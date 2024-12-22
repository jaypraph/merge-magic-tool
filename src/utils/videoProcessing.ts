export const createSlideshow = async (images: string[]): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Set video dimensions (2880x2160)
  canvas.width = 2880;
  canvas.height = 2160;

  const stream = canvas.captureStream(30); // 30 FPS
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=h264',
    videoBitsPerSecond: 8000000 // 8 Mbps for high quality
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

    // Process each image
    for (const imageUrl of images) {
      try {
        await new Promise<void>(async (resolveTransition) => {
          // Load image
          const img = new Image();
          img.src = imageUrl;
          await new Promise(resolve => img.onload = resolve);

          // Calculate aspect ratio preserving dimensions
          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );
          const newWidth = img.width * scale;
          const newHeight = img.height * scale;
          const x = (canvas.width - newWidth) / 2;
          const y = (canvas.height - newHeight) / 2;

          // Fade in (500ms)
          for (let alpha = 0; alpha <= 1; alpha += 0.1) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = alpha;
            ctx.drawImage(img, x, y, newWidth, newHeight);
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          // Hold for 1.5 seconds (full opacity)
          ctx.globalAlpha = 1;
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Fade out (500ms)
          for (let alpha = 1; alpha >= 0; alpha -= 0.1) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = alpha;
            ctx.drawImage(img, x, y, newWidth, newHeight);
            await new Promise(resolve => setTimeout(resolve, 50));
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