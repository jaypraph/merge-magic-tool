import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { FFmpeg } from 'https://esm.sh/@ffmpeg/ffmpeg@0.12.7'
import { toBlobURL, fetchFile } from 'https://esm.sh/@ffmpeg/util@0.12.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { slideshow_id, images } = await req.json()
    console.log('Processing slideshow:', slideshow_id)

    // Initialize FFmpeg
    const ffmpeg = new FFmpeg()
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    // Process images
    for (let i = 0; i < images.length; i++) {
      const imageData = await fetchFile(images[i])
      await ffmpeg.writeFile(`image${i}.jpg`, imageData)
    }

    // Create concat file
    const concatContent = images.map((_, i) => {
      return `file 'image${i}.jpg'\nduration 2.5`
    }).join('\n')
    await ffmpeg.writeFile('concat.txt', concatContent)

    // Create slideshow
    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat.txt',
      '-vf', 'scale=2880:2160:force_original_aspect_ratio=decrease,pad=2880:2160:(ow-iw)/2:(oh-ih)/2',
      '-r', '30',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '0307.mp4'
    ])

    // Read the output file
    const data = await ffmpeg.readFile('0307.mp4')
    const videoBlob = new Blob([data], { type: 'video/mp4' })

    // Upload to Supabase Storage
    const filePath = `${slideshow_id}/0307.mp4`
    const { error: uploadError } = await supabase.storage
      .from('slideshows')
      .upload(filePath, videoBlob, {
        contentType: 'video/mp4',
        upsert: true
      })

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('slideshows')
      .getPublicUrl(filePath)

    // Update slideshow status
    const { error: updateError } = await supabase
      .from('slideshows')
      .update({ 
        status: 'completed',
        video_path: publicUrl
      })
      .eq('id', slideshow_id)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ success: true, video_url: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing slideshow:', error)

    // Update slideshow status with error
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabase
      .from('slideshows')
      .update({ 
        status: 'error',
        error_message: error.message
      })
      .eq('id', (await req.json()).slideshow_id)

    return new Response(
      JSON.stringify({ 
        error: 'Failed to create slideshow',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})