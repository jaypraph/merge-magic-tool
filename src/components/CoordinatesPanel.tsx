import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoordinatesPanelProps {
  coordinates: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  rectangleMode: boolean;
  onSetDefaultCoordinates: () => void;
  onRectangleModeToggle: () => void;
}

export const CoordinatesPanel = ({
  coordinates,
  rectangleMode,
  onSetDefaultCoordinates,
  onRectangleModeToggle,
}: CoordinatesPanelProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-2">
        <Button
          onClick={onRectangleModeToggle}
          className={cn(
            "w-12 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white",
            rectangleMode
              ? "transform translate-y-[2px]"
              : "shadow-[0_4px_0_0_rgba(0,0,0,0.5)]"
          )}
        >
          R
        </Button>
        <Button
          onClick={onSetDefaultCoordinates}
          className={cn(
            "w-12 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white",
            "shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:transform hover:translate-y-[2px] hover:shadow-none"
          )}
        >
          <Database className="h-6 w-6" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Textarea
          value={coordinates.topLeft}
          readOnly
          placeholder="Top Left"
          className="h-12 text-base font-mono resize-none"
        />
        <Textarea
          value={coordinates.topRight}
          readOnly
          placeholder="Top Right"
          className="h-12 text-base font-mono resize-none"
        />
        <Textarea
          value={coordinates.bottomLeft}
          readOnly
          placeholder="Bottom Left"
          className="h-12 text-base font-mono resize-none"
        />
        <Textarea
          value={coordinates.bottomRight}
          readOnly
          placeholder="Bottom Right"
          className="h-12 text-base font-mono resize-none"
        />
      </div>
    </div>
  );
};