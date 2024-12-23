import { changeDpiDataUrl } from "changedpi";
import { createSlideshow } from "./videoProcessing";
import { createImage, createWatermarkedImage, createMockupImage } from "./imageProcessing";
import { createMockup2Images } from "./mockupProcessing";

export interface ProcessImageResult {
  images: string[];
  video: Blob;
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
      jpgCanvas.width = 3840;
      jpgCanvas.height = 2160;
      jpgCtx?.drawImage(img1, 0, 0, 3840, 2160);
      const jpgImage = jpgCanvas.toDataURL("image/jpeg", 0.9);
      
      const dpiAdjustedImage = changeDpiDataUrl(jpgImage, 300);
      processedImages.push(dpiAdjustedImage);
      
      // Create watermarked version
      const watermarkedImage = await createWatermarkedImage(dpiAdjustedImage);
      processedImages.push(watermarkedImage);
      
      // Create mockup version
      const mockupImage = await createMockupImage("/lovable-uploads/e0990050-1d0a-4a84-957f-2ea4deb3af1f.png", dpiAdjustedImage);
      processedImages.push(mockupImage);
    }
    
    // Create video from processed images
    console.log("Creating video...");
    const video = await createSlideshow(processedImages);
    console.log("Video created");
    
    return {
      images: processedImages,
      video
    };
  } catch (error) {
    console.error("Error in image processing pipeline:", error);
    throw error;
  }
};