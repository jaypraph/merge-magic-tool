import { changeDpiDataUrl } from "changedpi";
import { mockupImages } from "@/constants/mockupDefaults";
import defaultImage from "/lovable-uploads/e0990050-1d0a-4a84-957f-2ea4deb3af1f.png";

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
  
  // Reduce resolution to 360p
  canvas.width = 480;
  canvas.height = 270;
  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  // Increase compression
  return canvas.toDataURL("image/jpeg", 0.6);
};

const resizeTo4K = async (imageUrl: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = await createImage(imageUrl);
  
  // Reduce resolution further
  canvas.width = 480;
  canvas.height = 270;
  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  // Increase compression
  return canvas.toDataURL("image/jpeg", 0.6);
};

const createWatermarkedImage = async (imageDataUrl: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = await createImage(imageDataUrl);
  
  // Match reduced resolution
  canvas.width = 480;
  canvas.height = 270;
  
  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  if (ctx) {
    // Adjust font size for smaller resolution
    const fontSize = Math.floor(canvas.height * 0.12);
    
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
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
    const logoWidth = canvas.width * 0.12;
    const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
    
    ctx.globalAlpha = 0.4;
    ctx.drawImage(logoImg, 8, 8, logoWidth, logoHeight);
    ctx.globalAlpha = 1.0;
  }
  
  // Increase compression
  return canvas.toDataURL("image/jpeg", 0.6);
};

const createMockup1 = async (imageUrl: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  // Match reduced resolution
  canvas.width = 480;
  canvas.height = 270;
  
  const mockupImg = await createImage(defaultImage);
  const uploadedImg = await createImage(imageUrl);
  
  ctx?.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);
  
  // Adjust coordinates for new resolution
  const scaleX = canvas.width / 1588;
  const scaleY = canvas.height / 1191;
  const x = Math.round(228 * scaleX);
  const y = Math.round(224 * scaleY);
  const width = Math.round((1362 - 228) * scaleX);
  const height = Math.round((841 - 224) * scaleY);
  
  ctx?.drawImage(uploadedImg, x, y, width, height);
  
  // Increase compression
  return canvas.toDataURL("image/jpeg", 0.6);
};

const createMockup2Variations = async (imageUrl: string): Promise<string[]> => {
  const mockupResults: string[] = [];

  for (const mockup of mockupImages) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Match reduced resolution
    canvas.width = 480;
    canvas.height = 270;

    try {
      const mockupImg = await createImage(mockup.src);
      const uploadedImg = await createImage(imageUrl);

      ctx?.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);

      const coords = mockup.defaultCoordinates;
      const topLeft = coords.topLeft.match(/\((\d+),(\d+)\)/);
      const topRight = coords.topRight.match(/\((\d+),(\d+)\)/);
      const bottomLeft = coords.bottomLeft.match(/\((\d+),(\d+)\)/);

      if (topLeft && topRight && bottomLeft) {
        // Scale coordinates for new resolution
        const scaleX = canvas.width / 2000;
        const scaleY = canvas.height / 2000;
        
        const x = Math.round(parseInt(topLeft[1]) * scaleX);
        const y = Math.round(parseInt(topLeft[2]) * scaleY);
        const width = Math.round((parseInt(topRight[1]) - parseInt(topLeft[1])) * scaleX);
        const height = Math.round((parseInt(bottomLeft[2]) - parseInt(topLeft[2])) * scaleY);

        ctx?.drawImage(uploadedImg, x, y, width, height);
      }

      // Increase compression
      const mergedImage = canvas.toDataURL("image/jpeg", 0.6);
      mockupResults.push(mergedImage);
    } catch (error) {
      console.error(`Error processing mockup:`, error);
    }
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
    
    // Convert and optimize images
    const jpgImage = await convertToJpg(uploadedImage);
    const resizedImage = await resizeTo4K(jpgImage);
    
    // Process images with optimized settings
    const dpiAdjustedImage = changeDpiDataUrl(resizedImage, 300);
    processedImages.push(dpiAdjustedImage);
    
    const watermarkedImage = await createWatermarkedImage(dpiAdjustedImage);
    processedImages.push(watermarkedImage);
    
    const mockup1Image = await createMockup1(dpiAdjustedImage);
    processedImages.push(mockup1Image);
    
    const mockup2Images = await createMockup2Variations(dpiAdjustedImage);
    processedImages.push(...mockup2Images);
    
    return { images: processedImages };
  } catch (error) {
    console.error("Error in image processing pipeline:", error);
    throw error;
  }
};