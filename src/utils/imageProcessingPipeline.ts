import { changeDpiDataUrl } from "changedpi";
import { createSlideshow } from "./videoProcessing";
import { createImage, createWatermarkedImage, createMockupImage } from "./imageProcessing";
import { createMockup2Images } from "./mockupProcessing";
import { mockupImages } from "@/constants/mockupDefaults";

export interface ProcessImageResult {
  images: string[];
  video: Blob;
}

export const processImage = async (uploadedImage?: string): Promise<ProcessImageResult> => {
  try {
    console.log("Starting image processing pipeline...");
    
    const processedImages: string[] = [];
    
    if (uploadedImage) {
      // Step 1: Create JPG version and resize to 4K
      const jpgCanvas = document.createElement("canvas");
      const jpgCtx = jpgCanvas.getContext("2d");
      const img1 = await createImage(uploadedImage);
      jpgCanvas.width = 3840;  // 4K width
      jpgCanvas.height = 2160; // 4K height
      jpgCtx?.drawImage(img1, 0, 0, 3840, 2160);
      const jpgImage = jpgCanvas.toDataURL("image/jpeg", 0.9);
      
      // Step 2: Apply 300 DPI to the matrix image
      const dpiAdjustedImage = changeDpiDataUrl(jpgImage, 300);
      processedImages.push(dpiAdjustedImage); // This will be mtrx-1.jpg
      
      // Step 3: Create watermarked version
      const watermarkedImage = await createWatermarkedImage(dpiAdjustedImage);
      processedImages.push(watermarkedImage); // This will be wm-1.jpg
      
      // Step 4: Create mockup versions for all mockup images
      for (const mockup of mockupImages) {
        const mockupPath = mockup.src.startsWith('/') ? mockup.src : `/${mockup.src}`;
        const mockupImage = await createMockupImage(mockupPath, dpiAdjustedImage);
        // Apply 300 DPI to mockup images as well
        const dpiAdjustedMockup = changeDpiDataUrl(mockupImage, 300);
        processedImages.push(dpiAdjustedMockup);
      }
    }
    
    // Step 5: Create video from all processed images
    console.log("Creating video from processed images...");
    const video = await createSlideshow(processedImages);
    console.log("Video creation completed");
    
    return {
      images: processedImages,
      video
    };
  } catch (error) {
    console.error("Error in image processing pipeline:", error);
    throw error;
  }
};