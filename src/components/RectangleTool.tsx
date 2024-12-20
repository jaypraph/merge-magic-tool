import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Coordinates {
  x: number;
  y: number;
}

interface Rectangle {
  start: Coordinates;
  end: Coordinates;
}

interface RectangleToolProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const RectangleTool = ({ containerRef }: RectangleToolProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectangle, setRectangle] = useState<Rectangle | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setRectangle({
      start: { x, y },
      end: { x, y }
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !rectangle || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate the side length based on the larger difference
    const xDiff = Math.abs(x - rectangle.start.x);
    const yDiff = Math.abs(y - rectangle.start.y);
    const sideLength = Math.max(xDiff, yDiff);
    
    // Determine the direction to maintain square shape
    const xDir = x >= rectangle.start.x ? 1 : -1;
    const yDir = y >= rectangle.start.y ? 1 : -1;
    
    setRectangle({
      start: rectangle.start,
      end: {
        x: rectangle.start.x + (sideLength * xDir),
        y: rectangle.start.y + (sideLength * yDir)
      }
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className={cn(
          "absolute top-4 left-4 z-10 w-10 h-10 text-black shadow-md",
          rectangle ? "shadow-inner bg-accent" : "hover:shadow-lg"
        )}
        onClick={() => setRectangle(null)}
      >
        R
      </Button>

      {rectangle && (
        <div
          className="absolute border-2 border-black pointer-events-none"
          style={{
            left: Math.min(rectangle.start.x, rectangle.end.x),
            top: Math.min(rectangle.start.y, rectangle.end.y),
            width: Math.abs(rectangle.end.x - rectangle.start.x),
            height: Math.abs(rectangle.end.y - rectangle.start.y),
          }}
        >
          <span className="absolute top-0 left-0 -translate-y-6 text-xs text-black">
            ({Math.round(Math.min(rectangle.start.x, rectangle.end.x))}, 
            {Math.round(Math.min(rectangle.start.y, rectangle.end.y))})
          </span>
          
          <span className="absolute top-0 right-0 -translate-y-6 text-xs text-black">
            ({Math.round(Math.max(rectangle.start.x, rectangle.end.x))}, 
            {Math.round(Math.min(rectangle.start.y, rectangle.end.y))})
          </span>
          
          <span className="absolute bottom-0 left-0 translate-y-6 text-xs text-black">
            ({Math.round(Math.min(rectangle.start.x, rectangle.end.x))}, 
            {Math.round(Math.max(rectangle.start.y, rectangle.end.y))})
          </span>
          
          <span className="absolute bottom-0 right-0 translate-y-6 text-xs text-black">
            ({Math.round(Math.max(rectangle.start.x, rectangle.end.x))}, 
            {Math.round(Math.max(rectangle.start.y, rectangle.end.y))})
          </span>
        </div>
      )}
    </>
  );
};