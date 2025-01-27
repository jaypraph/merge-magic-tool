import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { LockAllButton } from "./LockAllButton";

interface TextFeaturesHeaderProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onClearAll: () => void;
  isAnyUnlocked: boolean;
  onLockAll: () => void;
}

export function TextFeaturesHeader({ 
  isEnabled, 
  onToggle,
  onClearAll,
  isAnyUnlocked,
  onLockAll
}: TextFeaturesHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={isEnabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-blue-500"
          />
          <span className="text-sm text-gray-500">
            Title-Description Sync
          </span>
        </div>
        <LockAllButton 
          isAnyUnlocked={isAnyUnlocked} 
          onToggle={onLockAll}
        />
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={onClearAll}
        className="gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Clear All
      </Button>
    </div>
  );
}