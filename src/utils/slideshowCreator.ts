import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import JSZip from "jszip";

export const createSlideshow = async (
  images: string[],
  zip: JSZip,
  onStageUpdate: (stage: string) => void
) => {
  onStageUpdate("Creating slideshow video...");
  
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();
  
  // Write each image to FFmpeg's virtual filesystem
  for (let i = 0; i < images.length; i++) {
    const imageData = images[i].split('base64,')[1];
    await ffmpeg.writeFile(`image${i}.jpg`, await fetchFile(
      `data:image/jpeg;base64,${imageData}`
    ));
  }

  // Create a file list for FFmpeg
  const fileList = images.map((_, i) => 
    `file 'image${i}.jpg'`
  ).join('\n');
  await ffmpeg.writeFile('files.txt', fileList);

  // Create slideshow with 2.5s duration per image
  await ffmpeg.exec([
    '-f', 'concat',
    '-safe', '0',
    '-i', 'files.txt',
    '-framerate', '30',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-s', '2880x2160',
    '-vf', 'fps=30,format=yuv420p',
    '-frame_pts', '1',
    '-vf', `setpts=2.5*N/(30*TB)`,
    'output.mp4'
  ]);

  // Read the output video
  const data = await ffmpeg.readFile('output.mp4');
  const videoBlob = new Blob([data], { type: 'video/mp4' });
  const videoBase64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(videoBlob);
  });

  // Add video to ZIP
  zip.file("0307.mp4", videoBase64.split('base64,')[1], { base64: true });
};