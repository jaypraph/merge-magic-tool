import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export const initializeFFmpeg = async () => {
  try {
    console.log('Creating new FFmpeg instance...');
    const ffmpeg = new FFmpeg();
    
    console.log('Setting up FFmpeg core files...');
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    console.log('Loading core.js...');
    let coreURL;
    try {
      coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
      console.log('Successfully loaded core.js');
    } catch (error) {
      console.error('Failed to load core.js:', error);
      throw new Error('Failed to load FFmpeg core.js');
    }
    
    console.log('Loading core.wasm...');
    let wasmURL;
    try {
      wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
      console.log('Successfully loaded core.wasm');
    } catch (error) {
      console.error('Failed to load core.wasm:', error);
      throw new Error('Failed to load FFmpeg core.wasm');
    }
    
    console.log('Initializing FFmpeg with core files...');
    try {
      await ffmpeg.load({
        coreURL,
        wasmURL,
      });
      console.log('FFmpeg load completed successfully');
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      throw new Error('Failed to initialize FFmpeg with core files');
    }
    
    return ffmpeg;
  } catch (error) {
    console.error('FFmpeg initialization failed:', error);
    throw error;
  }
};

export const processImages = async (ffmpeg: FFmpeg, images: string[]) => {
  try {
    console.log('Starting image processing...');
    console.log(`Total images to process: ${images.length}`);

    for (let i = 0; i < images.length; i++) {
      console.log(`\nProcessing image ${i + 1}/${images.length}`);
      
      if (!images[i]) {
        console.error(`Image ${i + 1} is missing or undefined`);
        throw new Error(`Image ${i + 1} is empty or invalid`);
      }

      const parts = images[i].split(',');
      if (parts.length !== 2) {
        console.error(`Invalid image format for image ${i + 1}`);
        throw new Error(`Invalid image format for image ${i + 1}`);
      }

      const base64Data = parts[1];
      console.log(`Image ${i + 1} base64 length: ${base64Data.length}`);

      try {
        console.log(`Converting base64 to binary for image ${i + 1}`);
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let j = 0; j < binaryString.length; j++) {
          bytes[j] = binaryString.charCodeAt(j);
        }
        console.log(`Binary conversion successful for image ${i + 1}`);
        
        const filename = `image${i}.jpg`;
        console.log(`Writing ${filename} to FFmpeg filesystem`);
        await ffmpeg.writeFile(filename, bytes);
        console.log(`Successfully wrote ${filename}`);
      } catch (error) {
        console.error(`Error processing image ${i + 1}:`, error);
        throw new Error(`Failed to process image ${i + 1}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    console.log('\nAll images processed successfully');
  } catch (error) {
    console.error('Error in processImages:', error);
    throw error;
  }
};

export const createConcatFile = async (ffmpeg: FFmpeg, imageCount: number) => {
  try {
    console.log('\nCreating concat file...');
    console.log(`Creating content for ${imageCount} images`);
    
    const concatContent = Array.from({ length: imageCount }, (_, i) => {
      const line = `file 'image${i}.jpg'\nduration 2.5`;
      console.log(`Adding line: ${line}`);
      return line;
    }).join('\n');
    
    console.log('Writing concat file to FFmpeg filesystem');
    await ffmpeg.writeFile('concat.txt', concatContent);
    console.log('Concat file created successfully');
    console.log('Concat file content:', concatContent);
  } catch (error) {
    console.error('Error creating concat file:', error);
    throw new Error(`Failed to create concat file: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const createSlideshow = async (ffmpeg: FFmpeg) => {
  try {
    console.log('\nStarting slideshow creation...');
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
    try {
      await ffmpeg.exec(command);
      console.log('FFmpeg command executed successfully');
    } catch (error) {
      console.error('FFmpeg command execution failed:', error);
      throw new Error(`FFmpeg command execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    console.log('Verifying output file...');
    try {
      const data = await ffmpeg.readFile('0307.mp4');
      console.log('Output file size:', data.length, 'bytes');
      if (data.length === 0) {
        throw new Error('Output file is empty');
      }
    } catch (error) {
      console.error('Error reading output file:', error);
      throw new Error('Failed to verify output file');
    }
    
    console.log('Slideshow created successfully');
  } catch (error) {
    console.error('Error creating slideshow:', error);
    throw error;
  }
};