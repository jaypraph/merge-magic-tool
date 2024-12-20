import { useCallback, useEffect, useRef, useState } from "react";

interface DrawingCanvasProps {
  image: string;
  rectangleMode: boolean;
  onCoordinatesChange?: (coordinates: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  }) => void;
}

export const DrawingCanvas = ({ 
  image, 
  rectangleMode,
  onCoordinatesChange 
}: DrawingCanvasProps) => {
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
  }, [image, rectangleMode]);

  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY)
    };
  }, []);

  const drawCoordinates = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.font = '48px Arial';
    ctx.fillStyle = '#000000';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Top-left coordinates
    ctx.fillText(`(${x},${y})`, x - 15, y - 15);
    
    // Top-right coordinates
    ctx.fillText(`(${x + width},${y})`, x + width + 15, y - 15);
    
    // Bottom-left coordinates
    ctx.fillText(`(${x},${y + height})`, x - 15, y + height + 45);
    
    // Bottom-right coordinates
    ctx.fillText(`(${x + width},${y + height})`, x + width + 15, y + height + 45);

    // Reset shadow settings to prevent affecting other drawings
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
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
      
      const width = currentPos.x - startPos.x;
      const height = currentPos.y - startPos.y;
      
      const rectX = Math.min(startPos.x, currentPos.x);
      const rectY = Math.min(startPos.y, currentPos.y);
      const rectWidth = Math.abs(width);
      const rectHeight = Math.abs(height);
      
      ctx.rect(rectX, rectY, rectWidth, rectHeight);
      ctx.stroke();
      
      drawCoordinates(ctx, rectX, rectY, rectWidth, rectHeight);
    };
    img.src = image;
  }, [isDrawing, rectangleMode, startPos, image, getMousePos, drawCoordinates]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && rectangleMode) {
      const currentPos = getMousePos(e);
      const width = currentPos.x - startPos.x;
      const height = currentPos.y - startPos.y;
      
      const rectX = Math.min(startPos.x, currentPos.x);
      const rectY = Math.min(startPos.y, currentPos.y);
      const rectWidth = Math.abs(width);
      const rectHeight = Math.abs(height);
      
      onCoordinatesChange?.({
        topLeft: `(${rectX},${rectY})`,
        topRight: `(${rectX + rectWidth},${rectY})`,
        bottomLeft: `(${rectX},${rectY + rectHeight})`,
        bottomRight: `(${rectX + rectWidth},${rectY + rectHeight})`
      });
    }
    setIsDrawing(false);
  }, [isDrawing, rectangleMode, getMousePos, startPos, onCoordinatesChange]);

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
