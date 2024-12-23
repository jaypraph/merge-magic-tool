import { changeDpiDataUrl } from "changedpi";
import { convertToJpg, resizeTo4K } from './imageOperations';
import { createWatermarkedImage } from './watermarkOperations';
import { createMockup1, createMockup2Variations } from './mockupOperations';
import { createSlideshow } from './videoOperations';

export interface ProcessImageResult {
  images: string[];
}

export const processImage = async (
  uploadedImage?: string,
  setProcessingStage?: (stage: string) => void
): Promise<ProcessImageResult> => {
  try {
    console.log("Starting image processing pipeline...");
    
    if (!uploadedImage) {
      throw new Error("No image provided");
    }

    const processedImages: string[] = [];
    
    // 1. Convert PNG to JPG and resize to 4K
    setProcessingStage?.("Converting to JPG...");
    const jpgImage = await convertToJpg(uploadedImage);
    
    setProcessingStage?.("Resizing to 4K...");
    const resizedImage = await resizeTo4K(jpgImage);
    
    // 2. Set DPI to 300 and save as mtrx-1
    setProcessingStage?.("Adjusting DPI...");
    const dpiAdjustedImage = changeDpiDataUrl(resizedImage, 300);
    processedImages.push(dpiAdjustedImage);
    
    // 3. Create watermarked version (wm-1)
    setProcessingStage?.("Adding watermark...");
    const watermarkedImage = await createWatermarkedImage(dpiAdjustedImage);
    processedImages.push(watermarkedImage);
    
    // 4. Create Mockup 1 (oreomock5)
    setProcessingStage?.("Creating first mockup...");
    const mockup1Image = await createMockup1(dpiAdjustedImage);
    processedImages.push(mockup1Image);
    
    // 5. Create seven Mockup 2 variations
    setProcessingStage?.("Creating mockup variations...");
    const mockup2Images = await createMockup2Variations(dpiAdjustedImage);
    processedImages.push(...mockup2Images);

    // 6. Create slideshow video
    setProcessingStage?.("Creating video slideshow...");
    const slideshowImages = [
      dpiAdjustedImage,
      mockup1Image,
      mockup2Images[0],
      mockup2Images[1],
      mockup2Images[3]
    ];

    const videoBase64 = await createSlideshow(slideshowImages);
    processedImages.push(videoBase64);
    
    return { images: processedImages };
  } catch (error) {
    console.error("Error in image processing pipeline:", error);
    throw error;
  }
};