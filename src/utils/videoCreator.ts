import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export const createVideoFromImages = async (images: string[]) => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  // Write each image to FFmpeg's virtual filesystem
  for (let i = 0; i < images.length; i++) {
    const imageName = `image${i}.jpg`;
    const imageData = await fetchFile(images[i]);
    ffmpeg.FS('writeFile', imageName, imageData);
  }

  // Create a concat file that lists all images
  const concat = images.map((_, i) => {
    return `file 'image${i}.jpg'\nduration 2.5`;
  }).join('\n');
  ffmpeg.FS('writeFile', 'concat.txt', new TextEncoder().encode(concat));

  // Run FFmpeg command to create video
  await ffmpeg.run(
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
  );

  // Read the output video file
  const data = ffmpeg.FS('readFile', 'output.mp4');
  
  // Create a download link and trigger download
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'slideshow.mp4';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Cleanup FFmpeg filesystem
  images.forEach((_, i) => {
    ffmpeg.FS('unlink', `image${i}.jpg`);
  });
  ffmpeg.FS('unlink', 'concat.txt');
  ffmpeg.FS('unlink', 'output.mp4');
};