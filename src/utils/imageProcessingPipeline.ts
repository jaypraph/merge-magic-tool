import { createImage, createWatermarkedImage, createMockupImage } from "./imageProcessing";
import { mockupImages } from "@/constants/mockupDefaults";
import { changeDpiDataUrl } from "changedpi";

export interface ProcessImageResult {
  images: string[];
}

export const processImage = async (uploadedImage?: string): Promise<ProcessImageResult> => {
  try {
    console.log("Starting image processing pipeline...");
    
    const processedImages: string[] = [];
    
    if (uploadedImage) {
      // Create JPG version with 300 DPI
      const jpgCanvas = document.createElement("canvas");
      const jpgCtx = jpgCanvas.getContext("2d");
      const img1 = await createImage(uploadedImage);
      jpgCanvas.width = img1.width;
      jpgCanvas.height = img1.height;
      jpgCtx?.drawImage(img1, 0, 0, jpgCanvas.width, jpgCanvas.height);
      const jpgImage = jpgCanvas.toDataURL("image/jpeg", 0.9);
      
      const dpiAdjustedImage = changeDpiDataUrl(jpgImage, 300);
      processedImages.push(dpiAdjustedImage);
      
      // Create watermarked version
      const watermarkedImage = await createWatermarkedImage(dpiAdjustedImage);
      processedImages.push(watermarkedImage);
      
      // Create mockup versions for all mockup images
      for (const mockup of mockupImages) {
        const mockupPath = mockup.src.startsWith('/') ? mockup.src : `/${mockup.src}`;
        const mockupImage = await createMockupImage(mockupPath, dpiAdjustedImage);
        processedImages.push(mockupImage);
      }
    }
    
    return {
      images: processedImages
    };
  } catch (error) {
    console.error("Error in image processing pipeline:", error);
    throw error;
  }
};