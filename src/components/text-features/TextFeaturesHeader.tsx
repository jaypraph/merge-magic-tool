import { Switch } from "@/components/ui/switch";
import { ToggleLeft, ToggleRight } from "lucide-react";

interface TextFeaturesHeaderProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function TextFeaturesHeader({ isEnabled, onToggle }: TextFeaturesHeaderProps) {
  return (
    <div className="flex items-center justify-end p-4 border-b">
      <div className="flex items-center gap-2">
        {isEnabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
        <Switch
          checked={isEnabled}
          onCheckedChange={onToggle}
          aria-label="Toggle text features"
        />
      </div>
    </div>
  );
}