import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";

interface LockButtonProps {
  isLocked: boolean;
  onToggle: () => void;
}

export function LockButton({ isLocked, onToggle }: LockButtonProps) {
  return (
    <Button 
      onClick={onToggle}
      variant={isLocked ? "destructive" : "default"}
      size="sm"
    >
      {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
    </Button>
  );
}