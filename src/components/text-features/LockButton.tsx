import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LockButtonProps {
  isLocked: boolean;
  onToggle: () => void;
  label: string;
}

export function LockButton({ isLocked, onToggle, label }: LockButtonProps) {
  const { toast } = useToast();

  const handleToggle = () => {
    onToggle();
    toast({
      description: isLocked ? `${label} unlocked` : `${label} locked`,
    });
  };

  return (
    <Button 
      onClick={handleToggle}
      variant={isLocked ? "destructive" : "default"}
      size="sm"
    >
      {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
    </Button>
  );
}