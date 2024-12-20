import { changeDpiDataUrl } from "changedpi";
import JSZip from 'jszip';

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
  
  // Set canvas dimensions to match the image
  canvas.width = img.width;
  canvas.height = img.height;
  
  ctx?.drawImage(img, 0, 0);
  
  if (ctx) {
    // Calculate font size based on image height (approximately 8% of image height)
    const fontSize = Math.floor(canvas.height * 0.08);
    
    // Add text watermark with calculated size
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
    
    // Reset shadow for logo
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Add logo watermark
    const logoImg = await createImage("/lovable-uploads/6a3b93f0-d58c-4c78-8496-4639c21555d2.png");
    const logoWidth = canvas.width * 0.15;
    const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
    
    ctx.globalAlpha = 0.4;
    ctx.drawImage(logoImg, 10, 10, logoWidth, logoHeight);
    ctx.globalAlpha = 1.0;
  }
  
  const watermarkedImage = canvas.toDataURL("image/jpeg", 0.9);
  return changeDpiDataUrl(watermarkedImage, 300); // Apply 300 DPI to watermarked image
};

export const createMockupImage = async (defaultImage: string, processedImage: string): Promise<string> => {
  const mockupCanvas = document.createElement("canvas");
  const mockupCtx = mockupCanvas.getContext("2d");
  mockupCanvas.width = 1588;
  mockupCanvas.height = 1191;

  const defaultImg = await createImage(defaultImage);
  const processedImg = await createImage(processedImage);

  mockupCtx?.drawImage(defaultImg, 0, 0, mockupCanvas.width, mockupCanvas.height);
  mockupCtx?.drawImage(
    processedImg,
    228, 224,  // top-left coordinates
    1362 - 228, 841 - 224  // width and height based on coordinates
  );

  return mockupCanvas.toDataURL("image/jpeg", 0.9);
};

export const createZipFile = async (
  processedImage: string,
  mockupImage: string,
  watermarkedImage: string
): Promise<Blob> => {
  const zip = new JSZip();
  
  zip.file("processed.jpg", processedImage.split('base64,')[1], {base64: true});
  zip.file("mockup.jpg", mockupImage.split('base64,')[1], {base64: true});
  zip.file("watermarked.jpg", watermarkedImage.split('base64,')[1], {base64: true});

  return await zip.generateAsync({type: "blob"});
};