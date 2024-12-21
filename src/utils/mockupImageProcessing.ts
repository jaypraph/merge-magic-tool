export const createMockupImage = async (mockupSrc: string, image2: string, mockupCoordinates: any) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  // Set specific dimensions for mockup
  canvas.width = 1588;
  canvas.height = 1191;

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
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

  const img1 = await loadImage(mockupSrc);
  const img2 = await loadImage(image2);

  ctx?.drawImage(img1, 0, 0, canvas.width, canvas.height);

  const topLeft = parseCoordinates(mockupCoordinates.topLeft);
  const topRight = parseCoordinates(mockupCoordinates.topRight);
  const bottomLeft = parseCoordinates(mockupCoordinates.bottomLeft);
  const bottomRight = parseCoordinates(mockupCoordinates.bottomRight);

  if (topLeft && topRight && bottomLeft && bottomRight) {
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

  return canvas.toDataURL("image/png");
};