import { changeDpiDataUrl } from "changedpi";
import { mockupImages } from "@/constants/mockupDefaults";
import defaultImage from "/lovable-uploads/e0990050-1d0a-4a84-957f-2ea4deb3af1f.png";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export interface ProcessImageResult {
  images: string[];
}

const createImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const convertToJpg = async (pngImage: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = await createImage(pngImage);
  
  canvas.width = img.width;
  canvas.height = img.height;
  ctx?.drawImage(img, 0, 0);
  
  return canvas.toDataURL("image/jpeg", 0.9);
};

const resizeTo4K = async (imageUrl: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = await createImage(imageUrl);
  
  canvas.width = 3840;
  canvas.height = 2160;
  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL("image/jpeg", 0.9);
};

const createWatermarkedImage = async (imageDataUrl: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = await createImage(imageDataUrl);
  
  canvas.width = img.width;
  canvas.height = img.height;
  
  ctx?.drawImage(img, 0, 0);
  
  if (ctx) {
    // Doubled the fontSize by multiplying by 0.16 instead of 0.08
    const fontSize = Math.floor(canvas.height * 0.16);
    
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillText(
      "Ultra High Resolution",
      canvas.width / 2,
      canvas.height / 2
    );
    
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    const logoImg = await createImage("/lovable-uploads/6a3b93f0-d58c-4c78-8496-4639c21555d2.png");
    const logoWidth = canvas.width * 0.15;
    const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
    
    ctx.globalAlpha = 0.4;
    ctx.drawImage(logoImg, 10, 10, logoWidth, logoHeight);
    ctx.globalAlpha = 1.0;
  }
  
  return canvas.toDataURL("image/jpeg", 0.9);
};

const createMockup1 = async (imageUrl: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  canvas.width = 1588;
  canvas.height = 1191;
  
  const mockupImg = await createImage(defaultImage);
  const uploadedImg = await createImage(imageUrl);
  
  ctx?.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);
  ctx?.drawImage(uploadedImg, 228, 224, 1362 - 228, 841 - 224);
  
  return canvas.toDataURL("image/jpeg", 0.9);
};

const createMockup2Variations = async (imageUrl: string): Promise<string[]> => {
  const mockupResults: string[] = [];

  for (const mockup of mockupImages) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = 2000;
    canvas.height = 2000;

    try {
      const mockupImg = await createImage(mockup.src);
      const uploadedImg = await createImage(imageUrl);

      ctx?.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);

      const coords = mockup.defaultCoordinates;
      const topLeft = coords.topLeft.match(/\((\d+),(\d+)\)/);
      const topRight = coords.topRight.match(/\((\d+),(\d+)\)/);
      const bottomLeft = coords.bottomLeft.match(/\((\d+),(\d+)\)/);

      if (topLeft && topRight && bottomLeft) {
        const width = parseInt(topRight[1]) - parseInt(topLeft[1]);
        const height = parseInt(bottomLeft[2]) - parseInt(topLeft[2]);
        const x = parseInt(topLeft[1]);
        const y = parseInt(topLeft[2]);

        const scaleX = canvas.width / mockupImg.width;
        const scaleY = canvas.height / mockupImg.height;
        
        const scaledX = Math.round(x * scaleX);
        const scaledY = Math.round(y * scaleY);
        const scaledWidth = Math.round(width * scaleX);
        const scaledHeight = Math.round(height * scaleY);

        ctx?.drawImage(uploadedImg, scaledX, scaledY, scaledWidth, scaledHeight);
      }

      const mergedImage = canvas.toDataURL("image/jpeg", 0.9);
      mockupResults.push(mergedImage);
    } catch (error) {
      console.error(`Error processing mockup:`, error);
    }
  }

  return mockupResults;
};

const createSlideshow = async (images: string[]): Promise<string> => {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  // Convert base64 images to files and write them to FFmpeg's virtual filesystem
  for (let i = 0; i < images.length; i++) {
    const imageData = images[i].split(',')[1];
    const uint8Array = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
    await ffmpeg.writeFile(`image${i}.jpg`, uint8Array);
  }

  // Create a file list for FFmpeg
  const fileList = images.map((_, i) => `file 'image${i}.jpg'`).join('\n');
  await ffmpeg.writeFile('files.txt', fileList);

  // Run FFmpeg command to create slideshow
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
    '-vf', `zoompan=d=75:fps=30`,  // 2.5 seconds per image (75 frames at 30fps)
    'output.mp4'
  ]);

  // Read the output file and convert to base64
  const data = await ffmpeg.readFile('output.mp4');
  const videoBlob = new Blob([data], { type: 'video/mp4' });
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(videoBlob);
  });
};

export const processImage = async (uploadedImage?: string): Promise<ProcessImageResult> => {
  try {
    console.log("Starting image processing pipeline...");
    
    if (!uploadedImage) {
      throw new Error("No image provided");
    }

    const processedImages: string[] = [];
    
    // 1. Convert PNG to JPG and resize to 4K
    const jpgImage = await convertToJpg(uploadedImage);
    const resizedImage = await resizeTo4K(jpgImage);
    
    // 2. Set DPI to 300 and save as mtrx-1
    const dpiAdjustedImage = changeDpiDataUrl(resizedImage, 300);
    processedImages.push(dpiAdjustedImage); // mtrx-1
    
    // 3. Create watermarked version (wm-1)
    const watermarkedImage = await createWatermarkedImage(dpiAdjustedImage);
    processedImages.push(watermarkedImage); // wm-1
    
    // 4. Create Mockup 1 (oreomock5)
    const mockup1Image = await createMockup1(dpiAdjustedImage);
    processedImages.push(mockup1Image); // oreomock5
    
    // 5. Create seven Mockup 2 variations
    const mockup2Images = await createMockup2Variations(dpiAdjustedImage);
    processedImages.push(...mockup2Images); // seven additional mockups

    // 6. Create slideshow video from selected images
    const slideshowImages = [
      dpiAdjustedImage, // mtrx-1
      mockup1Image,     // mockup-1
      mockup2Images[0], // mockup-2
      mockup2Images[1], // mockup-3
      mockup2Images[3]  // mockup-5
    ];

    const videoBase64 = await createSlideshow(slideshowImages);
    processedImages.push(videoBase64);
    
    return { images: processedImages };
  } catch (error) {
    console.error("Error in image processing pipeline:", error);
    throw error;
  }
};
