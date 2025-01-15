import { useState } from 'react';
import { createMediaRecorder, drawImageCentered, loadImage } from '@/utils/videoUtils';

export const useVideoCreation = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const createVideoFromImages = async (images: string[]): Promise<string> => {
    setIsProcessing(true);
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const mediaRecorder = createMediaRecorder(canvas);
      const chunks: Blob[] = [];
      
      canvas.width = 3840;
      canvas.height = 2160;
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setIsProcessing(false);
        resolve(url);
      };

      mediaRecorder.start();

      Promise.all(images.map(loadImage))
        .then(loadedImages => {
          const imageDuration = 2500;
          let startTime = performance.now();
          let currentImageIndex = 0;

          const animate = () => {
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
        })
        .catch(reject);
    });
  };

  return { createVideoFromImages, isProcessing };
};