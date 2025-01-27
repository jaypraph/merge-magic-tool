import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";

interface LockAllButtonProps {
  isAnyUnlocked: boolean;
  onToggle: () => void;
}

export function LockAllButton({ isAnyUnlocked, onToggle }: LockAllButtonProps) {
  return (
    <Button 
      onClick={onToggle}
      variant={isAnyUnlocked ? "default" : "destructive"}
      size="sm"
      className="gap-2"
    >
      {isAnyUnlocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
      {isAnyUnlocked ? "Lock All" : "Unlock All"}
    </Button>
  );
}