import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export const createSlideshow = async (images: string[]): Promise<string> => {
  console.log("Starting slideshow creation...");
  const ffmpeg = new FFmpeg();
  
  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    console.log("FFmpeg loaded successfully");

    for (let i = 0; i < images.length; i++) {
      const imageData = images[i].split(',')[1];
      const uint8Array = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
      await ffmpeg.writeFile(`image${i}.jpg`, uint8Array);
      console.log(`Written image ${i} to FFmpeg filesystem`);
    }

    const fileList = images.map((_, i) => `file 'image${i}.jpg'`).join('\n');
    await ffmpeg.writeFile('files.txt', fileList);
    console.log("File list created");

    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'files.txt',
      '-framerate', '30',
      '-vf', `scale=2880:2160:force_original_aspect_ratio=decrease,pad=2880:2160:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p`,
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-r', '30',
      '-framerate', '30',
      '-video_track_timescale', '30000',
      '-vf', `zoompan=d=75:fps=30`,
      'output.mp4'
    ]);

    console.log("FFmpeg command executed");

    const data = await ffmpeg.readFile('output.mp4');
    const videoBlob = new Blob([data], { type: 'video/mp4' });
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(videoBlob);
    });
  } catch (error) {
    console.error("Error in createSlideshow:", error);
    throw error;
  }
};