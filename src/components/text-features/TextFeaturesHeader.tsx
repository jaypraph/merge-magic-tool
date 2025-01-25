import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TextFeaturesHeaderProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function TextFeaturesHeader({ isEnabled, onToggle }: TextFeaturesHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <Switch
          id="sync-mode"
          checked={isEnabled}
          onCheckedChange={onToggle}
        />
        <Label htmlFor="sync-mode">Title-Description Sync</Label>
      </div>
    </div>
  );
}