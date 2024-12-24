import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { FFmpeg } from 'https://esm.sh/@ffmpeg/ffmpeg@0.12.7'
import { toBlobURL, fetchFile } from 'https://esm.sh/@ffmpeg/util@0.12.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    console.log('Starting slideshow creation process...')
    const { slideshow_id, images } = await req.json()
    console.log('Received request for slideshow:', slideshow_id)

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error('No images provided')
    }

    console.log('Creating Supabase client...')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Initialize FFmpeg with optimized configuration
    console.log('Initializing FFmpeg...')
    const ffmpeg = new FFmpeg()
    
    ffmpeg.on('log', ({ message }) => {
      console.log('FFmpeg log:', message)
    })

    await ffmpeg.load({
      coreURL: await toBlobURL(
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        'text/javascript',
        {
          headers: {
            'Cross-Origin-Resource-Policy': 'cross-origin',
          },
        }
      ),
      wasmURL: await toBlobURL(
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
        'application/wasm',
        {
          headers: {
            'Cross-Origin-Resource-Policy': 'cross-origin',
          },
        }
      ),
    })
    console.log('FFmpeg initialized successfully')

    // Process images with optimized settings
    console.log('Processing images...')
    for (let i = 0; i < images.length; i++) {
      console.log(`Processing image ${i + 1}/${images.length}`)
      const imageData = await fetchFile(images[i])
      await ffmpeg.writeFile(`image${i}.jpg`, imageData)
    }

    // Create optimized concat file
    console.log('Creating concat file...')
    const concatContent = images.map((_, i) => {
      return `file 'image${i}.jpg'\nduration 2`
    }).join('\n')
    await ffmpeg.writeFile('concat.txt', concatContent)

    // Create slideshow with optimized settings
    console.log('Creating slideshow video...')
    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat.txt',
      '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2',
      '-r', '24',
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '28',
      '-pix_fmt', 'yuv420p',
      '0307.mp4'
    ])

    // Read the output file
    console.log('Reading output file...')
    const data = await ffmpeg.readFile('0307.mp4')
    const videoBlob = new Blob([data], { type: 'video/mp4' })

    // Upload to Supabase Storage
    console.log('Uploading to storage...')
    const filePath = `${slideshow_id}/0307.mp4`
    const { error: uploadError } = await supabase.storage
      .from('slideshows')
      .upload(filePath, videoBlob, {
        contentType: 'video/mp4',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('slideshows')
      .getPublicUrl(filePath)

    // Update slideshow status
    console.log('Updating slideshow status...')
    const { error: updateError } = await supabase
      .from('slideshows')
      .update({ 
        status: 'completed',
        video_path: publicUrl
      })
      .eq('id', slideshow_id)

    if (updateError) {
      console.error('Update error:', updateError)
      throw updateError
    }

    console.log('Slideshow creation completed successfully')
    return new Response(
      JSON.stringify({ success: true, video_url: publicUrl }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error processing slideshow:', error)

    // Create Supabase client for error handling
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    try {
      // Update slideshow status with error
      await supabase
        .from('slideshows')
        .update({ 
          status: 'error',
          error_message: error.message
        })
        .eq('id', (await req.json()).slideshow_id)
    } catch (updateError) {
      console.error('Error updating slideshow status:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        error: 'Failed to create slideshow',
        details: error.message
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})