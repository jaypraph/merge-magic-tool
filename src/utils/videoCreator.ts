import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

const loadFFmpeg = async () => {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  }
  return ffmpeg;
};

export const createVideoFromImages = async (images: string[]) => {
  try {
    const ffmpeg = await loadFFmpeg();

    // Write each image to FFmpeg's virtual filesystem
    for (let i = 0; i < images.length; i++) {
      const imageName = `image${i}.jpg`;
      const imageData = await fetchFile(images[i]);
      await ffmpeg.writeFile(imageName, imageData);
    }

    // Create a concat file that lists all images
    const concat = images.map((_, i) => {
      return `file 'image${i}.jpg'\nduration 2.5`;
    }).join('\n');
    await ffmpeg.writeFile('concat.txt', new TextEncoder().encode(concat));

    // Run FFmpeg command to create video
    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat.txt',
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '23',
      '-s', '2880x2160',
      '-r', '30',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      'output.mp4'
    ]);

    // Read the output video file
    const data = await ffmpeg.readFile('output.mp4');
    
    // Create a download link and trigger download
    const url = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slideshow.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Cleanup FFmpeg filesystem
    for (let i = 0; i < images.length; i++) {
      await ffmpeg.deleteFile(`image${i}.jpg`);
    }
    await ffmpeg.deleteFile('concat.txt');
    await ffmpeg.deleteFile('output.mp4');
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};