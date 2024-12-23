import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export const createSlideshow = async (
  images: string[],
  setProgress: (progress: number) => void
): Promise<string> => {
  console.log("Starting slideshow creation...");
  const ffmpeg = new FFmpeg();
  
  try {
    console.log("Loading FFmpeg...");
    await ffmpeg.load({
      coreURL: await toBlobURL(`/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    console.log("FFmpeg loaded successfully");
    setProgress(10);

    // Write images to FFmpeg filesystem
    for (let i = 0; i < images.length; i++) {
      const imageData = images[i].split(',')[1];
      const uint8Array = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
      await ffmpeg.writeFile(`image${i}.jpg`, uint8Array);
      console.log(`Written image ${i} to FFmpeg filesystem`);
      setProgress(10 + ((i + 1) / images.length) * 30);
    }

    const fileList = images.map((_, i) => `file 'image${i}.jpg'`).join('\n');
    await ffmpeg.writeFile('files.txt', fileList);
    console.log("File list created");
    setProgress(45);

    // Log the progress
    ffmpeg.on('progress', ({ progress }) => {
      console.log('FFmpeg progress:', progress);
      setProgress(45 + progress * 45);
    });

    console.log("Starting FFmpeg command execution");
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

    console.log("FFmpeg command executed successfully");
    setProgress(90);

    const data = await ffmpeg.readFile('output.mp4');
    console.log("Video file read successfully");
    setProgress(95);

    const videoBlob = new Blob([data], { type: 'video/mp4' });
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProgress(100);
        resolve(reader.result as string);
      };
      reader.readAsDataURL(videoBlob);
    });
  } catch (error) {
    console.error("Error in createSlideshow:", error);
    throw error;
  }
};