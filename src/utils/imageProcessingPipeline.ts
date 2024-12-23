export interface ProcessImageResult {
  images: string[];
  video: Blob;
}

export const processImage = async (): Promise<ProcessImageResult> => {
  try {
    console.log("Starting image processing pipeline...");
    
    // Create an array to store processed images
    const processedImages: string[] = [];
    
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