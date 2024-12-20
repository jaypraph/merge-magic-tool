import { useCallback, useEffect, useRef, useState } from "react";

interface DrawingCanvasProps {
  image: string;
  rectangleMode: boolean;
}

export const DrawingCanvas = ({ image, rectangleMode }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        };
        img.src = image;
      }
    }
  }, [image]);

  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!rectangleMode) return;
    
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);
  }, [rectangleMode, getMousePos]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !rectangleMode) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    
    const currentPos = getMousePos(e);
    
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Calculate width and height ensuring they can be negative
      // This allows drawing in any direction while keeping cursor at top-left
      const width = currentPos.x - startPos.x;
      const height = currentPos.y - startPos.y;
      
      // Draw rectangle starting from the initial cursor position
      ctx.rect(
        Math.min(startPos.x, currentPos.x),
        Math.min(startPos.y, currentPos.y),
        Math.abs(width),
        Math.abs(height)
      );
      ctx.stroke();
    };
    img.src = image;
  }, [isDrawing, rectangleMode, startPos, image, getMousePos]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="max-w-full h-auto [cursor:crosshair_!important]"
      style={{ cursor: 'crosshair' }}
    />
  );
};
