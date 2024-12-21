import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Merge, FileImage, Maximize2, Gauge, Wrench } from "lucide-react";

interface TopMenuBarProps {
  activeFeature: string;
  onFeatureSelect: (feature: string) => void;
}

export const TopMenuBar = ({ activeFeature, onFeatureSelect }: TopMenuBarProps) => {
  const handleMockupClick = () => {
    onFeatureSelect(activeFeature === "mockup" ? "" : "mockup");
  };

  const handleMockup2Click = () => {
    onFeatureSelect(activeFeature === "mockup2" ? "" : "mockup2");
  };

  const handleJpgClick = () => {
    onFeatureSelect(activeFeature === "jpg" ? "" : "jpg");
  };

  const handleResizeClick = () => {
    onFeatureSelect(activeFeature === "resize" ? "" : "resize");
  };

  const handleDpiClick = () => {
    onFeatureSelect(activeFeature === "dpi" ? "" : "dpi");
  };

  const handleWmClick = () => {
    onFeatureSelect(activeFeature === "wm" ? "" : "wm");
  };

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          <Button
            onClick={handleJpgClick}
            className={cn(
              "w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white mr-2",
              activeFeature === "jpg"
                ? "transform translate-y-[2px]"
                : "shadow-[0_4px_0_0_rgba(0,0,0,0.5)]"
            )}
          >
            <FileImage className="mr-2 h-5 w-5" />
            JPG
          </Button>
          <Button
            onClick={handleResizeClick}
            className={cn(
              "w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white mr-2",
              activeFeature === "resize"
                ? "transform translate-y-[2px]"
                : "shadow-[0_4px_0_0_rgba(0,0,0,0.5)]"
            )}
          >
            <Maximize2 className="mr-2 h-5 w-5" />
            Resize
          </Button>
          <Button
            onClick={handleDpiClick}
            className={cn(
              "w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white mr-2",
              activeFeature === "dpi"
                ? "transform translate-y-[2px]"
                : "shadow-[0_4px_0_0_rgba(0,0,0,0.5)]"
            )}
          >
            <Gauge className="mr-2 h-5 w-5" />
            DPI
          </Button>
          <Button
            onClick={handleWmClick}
            className={cn(
              "w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white mr-2",
              activeFeature === "wm"
                ? "transform translate-y-[2px]"
                : "shadow-[0_4px_0_0_rgba(0,0,0,0.5)]"
            )}
          >
            <Wrench className="mr-2 h-5 w-5" />
            WM
          </Button>
          <Button
            onClick={handleMockupClick}
            className={cn(
              "w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white mr-2",
              activeFeature === "mockup"
                ? "transform translate-y-[2px]"
                : "shadow-[0_4px_0_0_rgba(0,0,0,0.5)]"
            )}
          >
            <Merge className="mr-2 h-5 w-5" />
            MockUp
          </Button>
          <Button
            onClick={handleMockup2Click}
            className={cn(
              "w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white mr-2",
              activeFeature === "mockup2"
                ? "transform translate-y-[2px]"
                : "shadow-[0_4px_0_0_rgba(0,0,0,0.5)]"
            )}
          >
            <Merge className="mr-2 h-5 w-5" />
            MockUp-2
          </Button>
        </div>
      </div>
    </div>
  );
};