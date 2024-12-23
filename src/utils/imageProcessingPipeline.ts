import { changeDpiDataUrl } from "changedpi";
import { mockupImages } from "@/constants/mockupDefaults";
import { createSlideshow } from "./videoProcessing";

const createImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      console.error("Error loading image:", src, e);
      reject(e);
    };
    img.src = src.startsWith('data:') ? src : src.replace(/^\//, '');
  });
};

export const convertToJpg = async (imageDataUrl: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  
  const img = await createImage(imageDataUrl);
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  
  return canvas.toDataURL("image/jpeg", 0.9);
};

export const resizeTo4K = async (imageDataUrl: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  
  const img = await createImage(imageDataUrl);
  
  canvas.width = 3840;
  canvas.height = 2160;
  
  const scale = Math.min(
    canvas.width / img.width,
    canvas.height / img.height
  );
  const newWidth = img.width * scale;
  const newHeight = img.height * scale;
  const x = (canvas.width - newWidth) / 2;
  const y = (canvas.height - newHeight) / 2;
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, x, y, newWidth, newHeight);
  
  const jpgOutput = canvas.toDataURL("image/jpeg", 0.9);
  return changeDpiDataUrl(jpgOutput, 300);
};

export const createMockup = async (mockupSrc: string, processedImage: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  
  canvas.width = 2000;
  canvas.height = 2000;

  try {
    const mockupImg = await createImage(mockupSrc);
    const contentImg = await createImage(processedImage);

    ctx.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);

    const mockupData = mockupImages.find(m => m.src === mockupSrc);
    if (mockupData) {
      const coords = mockupData.defaultCoordinates;
      const topLeft = parseCoordinates(coords.topLeft);
      const topRight = parseCoordinates(coords.topRight);
      const bottomLeft = parseCoordinates(coords.bottomLeft);

      if (topLeft && topRight && bottomLeft) {
        const scaleX = canvas.width / mockupImg.width;
        const scaleY = canvas.height / mockupImg.height;
        
        const scaledX = Math.round(topLeft.x * scaleX);
        const scaledY = Math.round(topLeft.y * scaleY);
        const scaledWidth = Math.round((topRight.x - topLeft.x) * scaleX);
        const scaledHeight = Math.round((bottomLeft.y - topLeft.y) * scaleY);

        ctx.drawImage(
          contentImg,
          scaledX,
          scaledY,
          scaledWidth,
          scaledHeight
        );
      }
    }

    const output = canvas.toDataURL("image/png");
    return changeDpiDataUrl(output, 300);
  } catch (error) {
    console.error("Error creating mockup:", error);
    throw error;
  }
};

const parseCoordinates = (coord: string) => {
  const match = coord.match(/\((\d+),(\d+)\)/);
  if (match) {
    return {
      x: parseInt(match[1]),
      y: parseInt(match[2])
    };
  }
  return null;
};

export const processImage = async (imageDataUrl: string): Promise<{
  images: string[];
  video: Blob;
}> => {
  try {
    console.log("Starting image processing pipeline...");
    
    const jpgVersion = await convertToJpg(imageDataUrl);
    console.log("Converted to JPG");
    
    const resizedVersion = await resizeTo4K(jpgVersion);
    console.log("Resized to 4K");
    
    const dpiAdjusted = changeDpiDataUrl(resizedVersion, 300);
    console.log("Adjusted DPI to 300");
    
    const selectedMockups = [
      mockupImages[0],
      mockupImages[1],
      mockupImages[2],
      mockupImages[4],
    ];
    
    console.log("Creating mockups...");
    const mockupResults = await Promise.all(
      selectedMockups.map(mockup => createMockup(mockup.src, dpiAdjusted))
    );
    console.log("Created all mockups");

    // Create video from processed images
    console.log("Creating video...");
    const video = await createSlideshow([dpiAdjusted, ...mockupResults]);
    console.log("Video created");
    
    return {
      images: [dpiAdjusted, ...mockupResults],
      video
    };
  } catch (error) {
    console.error("Error in image processing pipeline:", error);
    throw error;
  }
};