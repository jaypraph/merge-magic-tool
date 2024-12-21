import { changeDpiDataUrl } from "changedpi";
import JSZip from 'jszip';
import { mockupImages } from "@/constants/mockupDefaults";

export const createImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const createWatermarkedImage = async (imageDataUrl: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = await createImage(imageDataUrl);
  
  canvas.width = img.width;
  canvas.height = img.height;
  
  ctx?.drawImage(img, 0, 0);
  
  if (ctx) {
    const fontSize = Math.floor(canvas.height * 0.08);
    
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillText(
      "Ultra High Resolution",
      canvas.width / 2,
      canvas.height / 2
    );
    
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    const logoImg = await createImage("/lovable-uploads/6a3b93f0-d58c-4c78-8496-4639c21555d2.png");
    const logoWidth = canvas.width * 0.15;
    const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
    
    ctx.globalAlpha = 0.4;
    ctx.drawImage(logoImg, 10, 10, logoWidth, logoHeight);
    ctx.globalAlpha = 1.0;
  }
  
  const watermarkedImage = canvas.toDataURL("image/jpeg", 0.9);
  return changeDpiDataUrl(watermarkedImage, 300);
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

export const createMockupImage = async (mockupSrc: string, uploadedImage: string, coordinates: any): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  canvas.width = 2000;
  canvas.height = 2000;

  const mockupImg = await createImage(mockupSrc);
  const uploadedImg = await createImage(uploadedImage);

  ctx?.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);

  const topLeft = parseCoordinates(coordinates.topLeft);
  const topRight = parseCoordinates(coordinates.topRight);
  const bottomLeft = parseCoordinates(coordinates.bottomLeft);
  const bottomRight = parseCoordinates(coordinates.bottomRight);

  if (topLeft && topRight && bottomLeft && bottomRight) {
    const scaleX = canvas.width / mockupImg.width;
    const scaleY = canvas.height / mockupImg.height;
    
    const scaledX = Math.round(topLeft.x * scaleX);
    const scaledY = Math.round(topLeft.y * scaleY);
    const scaledWidth = Math.round((topRight.x - topLeft.x) * scaleX);
    const scaledHeight = Math.round((bottomLeft.y - topLeft.y) * scaleY);

    ctx?.drawImage(
      uploadedImg,
      scaledX,
      scaledY,
      scaledWidth,
      scaledHeight
    );
  }

  return canvas.toDataURL("image/jpeg", 0.9);
};

export const createZipFile = async (
  processedImage: string,
  mockupImage: string,
  watermarkedImage: string,
  uploadedImage: string
): Promise<Blob> => {
  const zip = new JSZip();
  
  // Add the standard processed images
  zip.file("processed.jpg", processedImage.split('base64,')[1], {base64: true});
  zip.file("mockup.jpg", mockupImage.split('base64,')[1], {base64: true});
  zip.file("watermarked.jpg", watermarkedImage.split('base64,')[1], {base64: true});

  // Add all seven mockup variations
  for (const mockup of mockupImages) {
    const mergedMockup = await createMockupImage(
      mockup.src,
      uploadedImage,
      mockup.defaultCoordinates
    );
    zip.file(`mockup-${mockup.id}.jpg`, mergedMockup.split('base64,')[1], {base64: true});
  }

  return await zip.generateAsync({type: "blob"});
};