import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";

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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setRectangle({
      start: { x, y },
      end: { x, y }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !rectangle) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRectangle({
      ...rectangle,
      end: { x, y }
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="absolute top-4 left-4 z-10"
        onClick={() => setRectangle(null)}
      >
        <Square className="h-4 w-4 mr-2" />
        Rectangle Tool
      </Button>

      {rectangle && (
        <div
          className="absolute border-2 border-blue-500 pointer-events-none"
          style={{
            left: Math.min(rectangle.start.x, rectangle.end.x),
            top: Math.min(rectangle.start.y, rectangle.end.y),
            width: Math.abs(rectangle.end.x - rectangle.start.x),
            height: Math.abs(rectangle.end.y - rectangle.start.y),
          }}
        >
          <span className="absolute top-0 left-0 -translate-y-6 text-xs text-slate-300">
            ({Math.round(Math.min(rectangle.start.x, rectangle.end.x))}, 
            {Math.round(Math.min(rectangle.start.y, rectangle.end.y))})
          </span>
          
          <span className="absolute top-0 right-0 -translate-y-6 text-xs text-slate-300">
            ({Math.round(Math.max(rectangle.start.x, rectangle.end.x))}, 
            {Math.round(Math.min(rectangle.start.y, rectangle.end.y))})
          </span>
          
          <span className="absolute bottom-0 left-0 translate-y-6 text-xs text-slate-300">
            ({Math.round(Math.min(rectangle.start.x, rectangle.end.x))}, 
            {Math.round(Math.max(rectangle.start.y, rectangle.end.y))})
          </span>
          
          <span className="absolute bottom-0 right-0 translate-y-6 text-xs text-slate-300">
            ({Math.round(Math.max(rectangle.start.x, rectangle.end.x))}, 
            {Math.round(Math.max(rectangle.start.y, rectangle.end.y))})
          </span>
        </div>
      )}
    </>
  );
};