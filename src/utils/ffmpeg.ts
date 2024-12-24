import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export const initializeFFmpeg = async () => {
  const ffmpeg = new FFmpeg();
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  return ffmpeg;
};

export const processImages = async (ffmpeg: FFmpeg, images: string[]) => {
  for (let i = 0; i < images.length; i++) {
    const base64Data = images[i].split(',')[1];
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let j = 0; j < len; j++) {
      bytes[j] = binaryString.charCodeAt(j);
    }
    
    await ffmpeg.writeFile(`image${i}.jpg`, bytes);
  }
};

export const createConcatFile = async (ffmpeg: FFmpeg, imageCount: number) => {
  const concatContent = Array.from({ length: imageCount }, (_, i) => 
    `file 'image${i}.jpg'\nduration 2.5`
  ).join('\n');
  await ffmpeg.writeFile('concat.txt', concatContent);
};

export const createSlideshow = async (ffmpeg: FFmpeg) => {
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
};