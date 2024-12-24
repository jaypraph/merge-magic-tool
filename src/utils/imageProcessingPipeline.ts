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

export const processImage = async (
  uploadedImage?: string,
  onStageUpdate?: (stage: string) => void
): Promise<ProcessImageResult> => {
  try {
    if (!uploadedImage) {
      throw new Error("No image provided");
    }

    const processedImages: string[] = [];
    
    // 1. Convert PNG to JPG and resize to 4K
    onStageUpdate?.("Converting to JPG...");
    const jpgImage = await convertToJpg(uploadedImage);
    
    onStageUpdate?.("Resizing to 4K...");
    const resizedImage = await resizeTo4K(jpgImage);
    
    // 2. Set DPI to 300 and save as mtrx-1
    onStageUpdate?.("Adjusting DPI...");
    const dpiAdjustedImage = changeDpiDataUrl(resizedImage, 300);
    processedImages.push(dpiAdjustedImage);
    
    // 3. Create watermarked version (wm-1)
    onStageUpdate?.("Adding watermark...");
    const watermarkedImage = await createWatermarkedImage(dpiAdjustedImage);
    processedImages.push(watermarkedImage);
    
    // 4. Create Mockup 1 (oreomock5)
    onStageUpdate?.("Creating mockup 1...");
    const mockup1Image = await createMockup1(dpiAdjustedImage);
    processedImages.push(mockup1Image);
    
    // 5. Create seven Mockup 2 variations
    onStageUpdate?.("Creating mockup variations...");
    const mockup2Images = await createMockup2Variations(dpiAdjustedImage);
    processedImages.push(...mockup2Images);
    
    return { images: processedImages };
  } catch (error) {
    console.error("Error in image processing pipeline:", error);
    throw error;
  }
};