import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

export const initializeFFmpeg = async () => {
  try {
    console.log('Creating new FFmpeg instance...');
    const ffmpeg = new FFmpeg();
    
    console.log('Loading FFmpeg core files...');
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    // Load core files in sequence
    console.log('Loading core files from:', baseURL);
    
    const coreURL = await toBlobURL(
      `${baseURL}/ffmpeg-core.js`,
      'text/javascript'
    );
    
    const wasmURL = await toBlobURL(
      `${baseURL}/ffmpeg-core.wasm`,
      'application/wasm'
    );
    
    console.log('Core files loaded, initializing FFmpeg...');
    
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
        throw new Error(`Image ${i + 1} is empty or invalid`);
      }

      // Convert base64 to binary
      const imageData = await fetchFile(images[i]);
      const filename = `image${i}.jpg`;
      
      console.log(`Writing ${filename} to FFmpeg filesystem`);
      await ffmpeg.writeFile(filename, imageData);
      console.log(`Successfully wrote ${filename}`);
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
    
    const concatContent = Array.from({ length: imageCount }, (_, i) => {
      return `file 'image${i}.jpg'\nduration 2.5`;
    }).join('\n');
    
    await ffmpeg.writeFile('concat.txt', concatContent);
    console.log('Concat file created successfully');
  } catch (error) {
    console.error('Error creating concat file:', error);
    throw error;
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
    console.log('FFmpeg command executed successfully');
    
    const data = await ffmpeg.readFile('0307.mp4');
    if (!data || data.length === 0) {
      throw new Error('Generated video file is empty');
    }
    
    console.log('Video file created successfully, size:', data.length, 'bytes');
    return data;
  } catch (error) {
    console.error('Error creating slideshow:', error);
    throw error;
  }
};