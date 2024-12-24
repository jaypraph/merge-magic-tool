import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export const initializeFFmpeg = async () => {
  try {
    console.log('Starting FFmpeg initialization...');
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    console.log('Loading FFmpeg core files...');
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    console.log('FFmpeg initialized successfully');
    return ffmpeg;
  } catch (error) {
    console.error('FFmpeg initialization failed:', error);
    throw new Error('Failed to initialize FFmpeg');
  }
};

export const processImages = async (ffmpeg: FFmpeg, images: string[]) => {
  try {
    console.log('Starting image processing...');
    for (let i = 0; i < images.length; i++) {
      console.log(`Processing image ${i + 1}/${images.length}`);
      const base64Data = images[i].split(',')[1];
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      
      for (let j = 0; j < len; j++) {
        bytes[j] = binaryString.charCodeAt(j);
      }
      
      console.log(`Writing image ${i} to FFmpeg...`);
      await ffmpeg.writeFile(`image${i}.jpg`, bytes);
      console.log(`Successfully wrote image ${i}`);
    }
    console.log('All images processed successfully');
  } catch (error) {
    console.error('Error processing images:', error);
    throw new Error('Failed to process images');
  }
};

export const createConcatFile = async (ffmpeg: FFmpeg, imageCount: number) => {
  try {
    console.log('Creating concat file...');
    const concatContent = Array.from({ length: imageCount }, (_, i) => 
      `file 'image${i}.jpg'\nduration 2.5`
    ).join('\n');
    await ffmpeg.writeFile('concat.txt', concatContent);
    console.log('Concat file created successfully');
  } catch (error) {
    console.error('Error creating concat file:', error);
    throw new Error('Failed to create concat file');
  }
};

export const createSlideshow = async (ffmpeg: FFmpeg) => {
  try {
    console.log('Starting slideshow creation...');
    console.log('FFmpeg command:', [
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat.txt',
      '-vf', 'scale=2880:2160:force_original_aspect_ratio=decrease,pad=2880:2160:(ow-iw)/2:(oh-ih)/2',
      '-r', '30',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '0307.mp4'
    ].join(' '));
    
    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat.txt',
      '-vf', 'scale=2880:2160:force_original_aspect_ratio=decrease,pad=2880:2160:(ow-iw)/2:(oh-ih)/2',
      '-r', '30',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '0307.mp4'
    ]);
    console.log('Slideshow created successfully');
  } catch (error) {
    console.error('Error creating slideshow:', error);
    throw new Error('Failed to create slideshow');
  }
};