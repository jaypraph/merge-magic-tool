import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Merge } from "lucide-react";

interface TopMenuBarProps {
  activeFeature: string;
  onFeatureSelect: (feature: string) => void;
}

export const TopMenuBar = ({ activeFeature, onFeatureSelect }: TopMenuBarProps) => {
  const handleMockupClick = () => {
    // If mockup is already active, deactivate it, otherwise activate it
    onFeatureSelect(activeFeature === "mockup" ? "" : "mockup");
  };

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
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
        </div>
      </div>
    </div>
  );
};