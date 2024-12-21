import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

const loadFFmpeg = async () => {
  try {
    console.log('Starting FFmpeg load process...');
    if (!ffmpeg) {
      ffmpeg = new FFmpeg();
      console.log('FFmpeg instance created');
      
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      console.log('Fetching FFmpeg core from:', baseURL);
      
      const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
      const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
      
      console.log('Core URLs created, loading FFmpeg...');
      await ffmpeg.load({
        coreURL,
        wasmURL
      });
      console.log('FFmpeg load completed successfully');
    }
    return ffmpeg;
  } catch (error) {
    console.error('Error loading FFmpeg:', error);
    throw new Error('Failed to load FFmpeg. Please try again.');
  }
};

export const createVideoFromImages = async (images: string[]) => {
  try {
    console.log('Starting video creation process...');
    const ffmpeg = await loadFFmpeg();
    console.log('FFmpeg loaded successfully');

    // Write each image to FFmpeg's virtual filesystem
    for (let i = 0; i < images.length; i++) {
      console.log(`Processing image ${i + 1}/${images.length}`);
      const imageName = `image${i}.jpg`;
      const imageData = await fetchFile(images[i]);
      await ffmpeg.writeFile(imageName, imageData);
    }
    console.log('All images written to FFmpeg filesystem');

    // Create a concat file that lists all images
    const concat = images.map((_, i) => {
      return `file 'image${i}.jpg'\nduration 2.5`;
    }).join('\n');
    await ffmpeg.writeFile('concat.txt', new TextEncoder().encode(concat));
    console.log('Concat file created');

    // Run FFmpeg command to create video
    console.log('Starting FFmpeg video creation...');
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
    console.log('FFmpeg video creation completed');

    // Read the output video file
    console.log('Reading output video file...');
    const data = await ffmpeg.readFile('output.mp4');
    console.log('Video file read successfully');
    
    // Create a download link and trigger download
    console.log('Creating download link...');
    const url = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slideshow.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('Video download triggered');

    // Cleanup FFmpeg filesystem
    console.log('Starting cleanup...');
    for (let i = 0; i < images.length; i++) {
      await ffmpeg.deleteFile(`image${i}.jpg`);
    }
    await ffmpeg.deleteFile('concat.txt');
    await ffmpeg.deleteFile('output.mp4');
    console.log('Cleanup completed');
  } catch (error) {
    console.error('Error in video creation:', error);
    throw error;
  }
};