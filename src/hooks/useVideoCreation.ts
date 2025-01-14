import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";

export const useVideoCreation = () => {
  const createVideoFromImages = async (images: string[]) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const mediaRecorder = await createMediaRecorder(canvas);
    const chunks: Blob[] = [];
    
    canvas.width = 3840;
    canvas.height = 2160;
    
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'slideshow.mp4';
      a.click();
      URL.revokeObjectURL(url);
      return true;
    };

    mediaRecorder.start();

    const loadedImages = await Promise.all(
      images.map(src => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = src;
        });
      })
    );

    const imageDuration = 2500;
    const transitionDuration = 500;
    
    let startTime = performance.now();
    let currentImageIndex = 0;

    const animate = async () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      
      if (!ctx) return;

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (currentImageIndex >= loadedImages.length) {
        mediaRecorder.stop();
        return;
      }

      const currentImage = loadedImages[currentImageIndex];
      const nextImage = loadedImages[currentImageIndex + 1];

      const progress = (elapsed % imageDuration) / imageDuration;

      drawImageCentered(ctx, currentImage, canvas.width, canvas.height);

      if (progress > 0.8 && nextImage) {
        const transitionProgress = (progress - 0.8) / 0.2;
        ctx.globalAlpha = 1 - transitionProgress;
        drawImageCentered(ctx, currentImage, canvas.width, canvas.height);
        ctx.globalAlpha = transitionProgress;
        drawImageCentered(ctx, nextImage, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
      }

      if (elapsed >= imageDuration) {
        startTime = currentTime;
        currentImageIndex++;
      }

      if (currentImageIndex < loadedImages.length) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const createMediaRecorder = async (canvas: HTMLCanvasElement) => {
    const stream = canvas.captureStream(30);
    return new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=h264',
      videoBitsPerSecond: 8000000
    });
  };

  const drawImageCentered = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const scale = Math.min(
      canvasWidth / img.width,
      canvasHeight / img.height
    );
    const x = (canvasWidth - img.width * scale) / 2;
    const y = (canvasHeight - img.height * scale) / 2;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  return { createVideoFromImages };
};