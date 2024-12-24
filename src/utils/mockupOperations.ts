import { createImage } from './imageOperations';
import defaultImage from "/lovable-uploads/e0990050-1d0a-4a84-957f-2ea4deb3af1f.png";
import { mockupImages } from "@/constants/mockupDefaults";

export const createMockup1 = async (imageUrl: string): Promise<string> => {
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

export const createMockup2Variations = async (imageUrl: string): Promise<string[]> => {
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