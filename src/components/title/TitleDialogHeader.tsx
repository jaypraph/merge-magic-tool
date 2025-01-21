import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";

interface TitleDialogHeaderProps {
  isLocked: boolean;
  onLockToggle: () => void;
  onClear: () => void;
}

export function TitleDialogHeader({ isLocked, onLockToggle, onClear }: TitleDialogHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <DialogTitle>Title Editor</DialogTitle>
      <div className="flex gap-2">
        <Button 
          onClick={onLockToggle}
          variant={isLocked ? "destructive" : "default"}
          size="sm"
        >
          {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
        </Button>
        <Button
          onClick={onClear}
          variant="outline"
          size="sm"
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}