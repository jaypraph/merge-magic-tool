import { createImage, createWatermarkedImage } from "./imageProcessing";
import { mockupImages } from "@/constants/mockupDefaults";
import { changeDpiDataUrl } from "changedpi";
import defaultImage from "/lovable-uploads/e0990050-1d0a-4a84-957f-2ea4deb3af1f.png";

export interface ProcessImageResult {
  images: string[];
}

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

      ctx?.drawImage(uploadedImg, x, y, width, height);
    }

    mockupResults.push(canvas.toDataURL("image/jpeg", 0.9));
  }

  return mockupResults;
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
    
    return { images: processedImages };
  } catch (error) {
    console.error("Error in image processing pipeline:", error);
    throw error;
  }
};