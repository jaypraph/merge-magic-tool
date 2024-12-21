import { createImage, createMockupImage } from './imageProcessing';
import { changeDpiDataUrl } from 'changedpi';
import { mockupImages } from '@/constants/mockupDefaults';

export const processImageForVideo = async (originalImage: string) => {
  try {
    // 1. Convert to JPG and resize to 4K
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = await createImage(originalImage);
    
    canvas.width = 3840;
    canvas.height = 2160;
    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const jpgImage = canvas.toDataURL('image/jpeg', 0.9);
    
    // 2. Convert DPI to 300
    const dpiAdjustedImage = changeDpiDataUrl(jpgImage, 300);
    
    // 3. Create selected mockups (1, 2, 3, 5)
    const selectedMockupIndices = [0, 1, 2, 4]; // Indices for mockups 1, 2, 3, 5
    const mockupResults = await Promise.all(
      selectedMockupIndices.map(async (index) => {
        const mockup = mockupImages[index];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 2000;
        canvas.height = 2000;

        const mockupImg = await createImage(mockup.src);
        const processedImg = await createImage(dpiAdjustedImage);

        ctx?.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);

        const coords = mockup.defaultCoordinates;
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
            processedImg,
            scaledX,
            scaledY,
            scaledWidth,
            scaledHeight
          );
        }

        return canvas.toDataURL('image/png');
      })
    );

    return [dpiAdjustedImage, ...mockupResults];
  } catch (error) {
    console.error('Error processing image:', error);
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