import { changeDpiDataUrl } from "changedpi";
import { mockupImages } from "@/constants/mockupDefaults";

const createImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      console.error("Error loading image:", src, e);
      reject(e);
    };
    // Ensure we're using the correct path format
    img.src = src.startsWith('data:') ? src : src.replace(/^\//, '');
  });
};

export const convertToJpg = async (imageDataUrl: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = await createImage(imageDataUrl);
  
  canvas.width = img.width;
  canvas.height = img.height;
  ctx?.drawImage(img, 0, 0);
  
  return canvas.toDataURL("image/jpeg", 0.9);
};

export const resizeTo4K = async (imageDataUrl: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = await createImage(imageDataUrl);
  
  // 4K UHD resolution
  canvas.width = 3840;
  canvas.height = 2160;
  
  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.9);
};

export const createMockup = async (mockupSrc: string, processedImage: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  canvas.width = 2000;
  canvas.height = 2000;

  try {
    const mockupImg = await createImage(mockupSrc);
    const contentImg = await createImage(processedImage);

    ctx?.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);

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

        ctx?.drawImage(
          contentImg,
          scaledX,
          scaledY,
          scaledWidth,
          scaledHeight
        );
      }
    }

    return canvas.toDataURL("image/png");
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

export const processImage = async (imageDataUrl: string): Promise<string[]> => {
  try {
    console.log("Starting image processing pipeline...");
    
    // Convert to JPG
    const jpgVersion = await convertToJpg(imageDataUrl);
    console.log("Converted to JPG");
    
    // Resize to 4K
    const resizedVersion = await resizeTo4K(jpgVersion);
    console.log("Resized to 4K");
    
    // Adjust DPI
    const dpiAdjusted = changeDpiDataUrl(resizedVersion, 300);
    console.log("Adjusted DPI to 300");
    
    // Create mockups (1, 2, 3, 5)
    const selectedMockups = [
      mockupImages[0], // mockup 1
      mockupImages[1], // mockup 2
      mockupImages[2], // mockup 3
      mockupImages[4], // mockup 5
    ];
    
    console.log("Creating mockups...");
    const mockupResults = await Promise.all(
      selectedMockups.map(mockup => createMockup(mockup.src, dpiAdjusted))
    );
    console.log("Created all mockups");
    
    // Return processed image and all mockups
    return [dpiAdjusted, ...mockupResults];
  } catch (error) {
    console.error("Error in image processing pipeline:", error);
    throw error;
  }
};