export const createMediaRecorder = (canvas: HTMLCanvasElement) => {
  const stream = canvas.captureStream(30);
  return new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=h264',
    videoBitsPerSecond: 8000000
  });
};

export const drawImageCentered = (
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

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
};