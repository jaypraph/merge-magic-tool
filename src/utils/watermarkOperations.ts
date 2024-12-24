import { createImage } from './imageOperations';

export const createWatermarkedImage = async (imageDataUrl: string): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = await createImage(imageDataUrl);
  
  canvas.width = img.width;
  canvas.height = img.height;
  
  ctx?.drawImage(img, 0, 0);
  
  if (ctx) {
    const fontSize = Math.floor(canvas.height * 0.16);
    
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
  
  return canvas.toDataURL("image/jpeg", 0.9);
};