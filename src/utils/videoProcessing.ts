export const createSlideshow = async (images: string[]): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = 3840;
  canvas.height = 2160;

  const stream = canvas.captureStream(30);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=h264',
    videoBitsPerSecond: 20000000 // 20 Mbps for ultra high quality
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

  return new Promise(async (resolve, reject) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      resolve(blob);
    };

    mediaRecorder.onerror = (error) => {
      reject(error);
    };

    mediaRecorder.start();

    for (const imageUrl of images) {
      try {
        await new Promise<void>(async (resolveTransition) => {
          const img = new Image();
          img.src = imageUrl;
          await new Promise(resolve => img.onload = resolve);

          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );
          const newWidth = img.width * scale;
          const newHeight = img.height * scale;
          const x = (canvas.width - newWidth) / 2;
          const y = (canvas.height - newHeight) / 2;

          // Quick fade in (150ms)
          for (let alpha = 0; alpha <= 1; alpha += 0.2) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = alpha;
            
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(img, x, y, newWidth, newHeight);
            await new Promise(resolve => setTimeout(resolve, 15));
          }

          // Hold for 2.2 seconds
          ctx.globalAlpha = 1;
          await new Promise(resolve => setTimeout(resolve, 2200));

          // Quick fade out (150ms)
          for (let alpha = 1; alpha >= 0; alpha -= 0.2) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = alpha;
            ctx.drawImage(img, x, y, newWidth, newHeight);
            await new Promise(resolve => setTimeout(resolve, 15));
          }

          resolveTransition();
        });
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }

    mediaRecorder.stop();
  });
};