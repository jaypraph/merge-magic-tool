import { mockupImages } from "@/constants/mockupDefaults";

export interface MockupResult {
  id: string;
  dataUrl: string;
}

export const createMockup2Images = async (uploadedImage: string): Promise<MockupResult[]> => {
  const mockupResults = [];
  
  for (const mockup of mockupImages) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = 2000;
    canvas.height = 2000;

    try {
      // Ensure we're using the correct path format
      const mockupPath = mockup.src.startsWith('/') ? mockup.src : `/${mockup.src}`;
      
      // Load mockup image
      const mockupImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = mockupPath;
      });

      // Load uploaded image
      const uploadedImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = uploadedImage;
      });

      // Draw mockup image
      ctx?.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);

      // Get coordinates from mockup data
      const coords = mockup.defaultCoordinates;
      const topLeft = coords.topLeft.match(/\((\d+),(\d+)\)/);
      const topRight = coords.topRight.match(/\((\d+),(\d+)\)/);
      const bottomLeft = coords.bottomLeft.match(/\((\d+),(\d+)\)/);

      if (topLeft && topRight && bottomLeft) {
        const width = parseInt(topRight[1]) - parseInt(topLeft[1]);
        const height = parseInt(bottomLeft[2]) - parseInt(topLeft[2]);
        const x = parseInt(topLeft[1]);
        const y = parseInt(topLeft[2]);

        // Draw uploaded image in the correct position
        ctx?.drawImage(uploadedImg, x, y, width, height);
      }

      mockupResults.push({
        id: mockup.id,
        dataUrl: canvas.toDataURL("image/png")
      });
    } catch (error) {
      console.error(`Error processing mockup ${mockup.id}:`, error);
    }
  }
  
  return mockupResults;
};