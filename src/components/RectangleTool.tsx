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

export const RectangleTool = () => {
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
    <div className="space-y-4">
      <Button 
        variant="outline" 
        className="absolute top-4 left-4"
        onClick={() => setRectangle(null)}
      >
        <Square className="h-4 w-4 mr-2" />
        Rectangle Tool
      </Button>

      <div
        className="relative w-full h-[500px] border border-slate-700 rounded-lg bg-slate-900"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {rectangle && (
          <div
            className="absolute border-2 border-blue-500"
            style={{
              left: Math.min(rectangle.start.x, rectangle.end.x),
              top: Math.min(rectangle.start.y, rectangle.end.y),
              width: Math.abs(rectangle.end.x - rectangle.start.x),
              height: Math.abs(rectangle.end.y - rectangle.start.y),
            }}
          >
            {/* Top-left coordinates */}
            <span className="absolute top-0 left-0 -translate-y-6 text-xs text-slate-300">
              ({Math.round(Math.min(rectangle.start.x, rectangle.end.x))}, 
              {Math.round(Math.min(rectangle.start.y, rectangle.end.y))})
            </span>
            
            {/* Top-right coordinates */}
            <span className="absolute top-0 right-0 -translate-y-6 text-xs text-slate-300">
              ({Math.round(Math.max(rectangle.start.x, rectangle.end.x))}, 
              {Math.round(Math.min(rectangle.start.y, rectangle.end.y))})
            </span>
            
            {/* Bottom-left coordinates */}
            <span className="absolute bottom-0 left-0 translate-y-6 text-xs text-slate-300">
              ({Math.round(Math.min(rectangle.start.x, rectangle.end.x))}, 
              {Math.round(Math.max(rectangle.start.y, rectangle.end.y))})
            </span>
            
            {/* Bottom-right coordinates */}
            <span className="absolute bottom-0 right-0 translate-y-6 text-xs text-slate-300">
              ({Math.round(Math.max(rectangle.start.x, rectangle.end.x))}, 
              {Math.round(Math.max(rectangle.start.y, rectangle.end.y))})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};