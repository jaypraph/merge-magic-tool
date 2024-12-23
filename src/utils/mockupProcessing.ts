import { createImage } from "./imageProcessing";
import { mockupImages } from "@/constants/mockupDefaults";

interface MockupResult {
  id: number;
  dataUrl: string;
}

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

export const createMockup2Images = async (uploadedImage: string): Promise<MockupResult[]> => {
  const mockupResults = [];
  for (const mockup of mockupImages) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = 2000;
    canvas.height = 2000;

    const img1 = await createImage(mockup.src);
    const img2 = await createImage(uploadedImage);

    ctx?.drawImage(img1, 0, 0, canvas.width, canvas.height);

    const coordinates = mockup.defaultCoordinates;
    const topLeft = parseCoordinates(coordinates.topLeft);
    const topRight = parseCoordinates(coordinates.topRight);
    const bottomLeft = parseCoordinates(coordinates.bottomLeft);

    if (topLeft && topRight && bottomLeft) {
      const scaleX = canvas.width / img1.width;
      const scaleY = canvas.height / img1.height;
      
      const scaledX = Math.round(topLeft.x * scaleX);
      const scaledY = Math.round(topLeft.y * scaleY);
      const scaledWidth = Math.round((topRight.x - topLeft.x) * scaleX);
      const scaledHeight = Math.round((bottomLeft.y - topLeft.y) * scaleY);

      ctx?.drawImage(
        img2,
        scaledX,
        scaledY,
        scaledWidth,
        scaledHeight
      );
    }

    mockupResults.push({
      id: mockup.id,
      dataUrl: canvas.toDataURL("image/png")
    });
  }
  return mockupResults;
};