import React from 'react';
import { DialogHeader as Header, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";

interface DialogHeaderProps {
  isLocked: boolean;
  onLockToggle: () => void;
  onClearAll: () => void;
}

export function DialogHeader({ 
  isLocked, 
  onLockToggle, 
  onClearAll 
}: DialogHeaderProps) {
  return (
    <Header className="flex flex-row items-center justify-between">
      <DialogTitle>Keyword Input</DialogTitle>
      <div className="flex items-center gap-2">
        <Button 
          onClick={onLockToggle}
          variant={isLocked ? "destructive" : "default"}
          size="sm"
        >
          {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onClearAll}
          disabled={isLocked}
        >
          Clear All
        </Button>
      </div>
    </Header>
  );
}