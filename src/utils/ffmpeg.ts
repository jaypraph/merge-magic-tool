import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export const initializeFFmpeg = async () => {
  try {
    console.log('Creating new FFmpeg instance...');
    const ffmpeg = new FFmpeg();
    
    console.log('Setting up FFmpeg core files...');
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    console.log('Loading core.js...');
    const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
    
    console.log('Loading core.wasm...');
    const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
    
    console.log('Initializing FFmpeg with core files...');
    await ffmpeg.load({
      coreURL,
      wasmURL,
    });
    
    console.log('FFmpeg initialized successfully');
    return ffmpeg;
  } catch (error) {
    console.error('FFmpeg initialization failed:', error);
    throw new Error(`Failed to initialize FFmpeg: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const processImages = async (ffmpeg: FFmpeg, images: string[]) => {
  try {
    console.log('Starting image processing...');
    for (let i = 0; i < images.length; i++) {
      console.log(`Processing image ${i + 1}/${images.length}`);
      
      if (!images[i]) {
        console.error(`Image ${i + 1} is missing`);
        throw new Error(`Image ${i + 1} is empty or invalid`);
      }

      const base64Data = images[i].split(',')[1];
      if (!base64Data) {
        console.error(`Invalid base64 data for image ${i + 1}`);
        throw new Error(`Invalid base64 data for image ${i + 1}`);
      }

      try {
        console.log(`Converting base64 to binary for image ${i + 1}`);
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let j = 0; j < binaryString.length; j++) {
          bytes[j] = binaryString.charCodeAt(j);
        }
        
        console.log(`Writing image ${i + 1} to FFmpeg filesystem`);
        await ffmpeg.writeFile(`image${i}.jpg`, bytes);
        console.log(`Successfully wrote image ${i + 1}`);
      } catch (error) {
        console.error(`Error processing image ${i + 1}:`, error);
        throw new Error(`Failed to process image ${i + 1}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    console.log('All images processed successfully');
  } catch (error) {
    console.error('Error in processImages:', error);
    throw error;
  }
};

export const createConcatFile = async (ffmpeg: FFmpeg, imageCount: number) => {
  try {
    console.log('Creating concat file...');
    const concatContent = Array.from({ length: imageCount }, (_, i) => 
      `file 'image${i}.jpg'\nduration 2.5`
    ).join('\n');
    
    console.log('Writing concat file to FFmpeg filesystem');
    await ffmpeg.writeFile('concat.txt', concatContent);
    console.log('Concat file created successfully');
  } catch (error) {
    console.error('Error creating concat file:', error);
    throw new Error(`Failed to create concat file: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const createSlideshow = async (ffmpeg: FFmpeg) => {
  try {
    console.log('Starting slideshow creation...');
    const command = [
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat.txt',
      '-vf', 'scale=2880:2160:force_original_aspect_ratio=decrease,pad=2880:2160:(ow-iw)/2:(oh-ih)/2',
      '-r', '30',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '0307.mp4'
    ];
    
    console.log('Executing FFmpeg command:', command.join(' '));
    await ffmpeg.exec(command);
    console.log('Slideshow created successfully');
  } catch (error) {
    console.error('Error creating slideshow:', error);
    throw new Error(`Failed to create slideshow: ${error instanceof Error ? error.message : String(error)}`);
  }
};