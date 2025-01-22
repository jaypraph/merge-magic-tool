import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TitleDialogHeader } from "./TitleDialogHeader";
import { TitleInput } from "./TitleInput";

interface TitleInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TitleInputDialog({ open, onOpenChange }: TitleInputDialogProps) {
  const [titles, setTitles] = useState<string[]>(() => {
    const savedTitles = localStorage.getItem('titleInput.titles');
    return savedTitles ? JSON.parse(savedTitles) : Array(4).fill('');
  });
  
  const [isLocked, setIsLocked] = useState(() => {
    return localStorage.getItem('titleInput.isLocked') === 'true';
  });
  
  const { toast } = useToast();

  const handleTitleChange = (index: number, value: string) => {
    if (isLocked) return;
    const newTitles = [...titles];
    newTitles[index] = value;
    setTitles(newTitles);
    localStorage.setItem('titleInput.titles', JSON.stringify(newTitles));
  };

  const handleLockToggle = () => {
    const newLockedState = !isLocked;
    setIsLocked(newLockedState);
    localStorage.setItem('titleInput.isLocked', newLockedState.toString());
    
    if (newLockedState) {
      // Filter out empty titles before transfer
      const nonEmptyTitles = titles.filter(title => title.trim() !== '');
      
      // Create and dispatch the transfer event
      const transferEvent = new CustomEvent('transferTitles', {
        detail: { titles: nonEmptyTitles }
      });
      document.dispatchEvent(transferEvent);
      
      // Save to localStorage for TextFeatures
      localStorage.setItem('textFeatures.titles', JSON.stringify(nonEmptyTitles));
      localStorage.setItem('textFeatures.titlesLocked', 'true');
      
      toast({
        description: "Titles locked and transferred to Text Features",
      });
    } else {
      toast({
        description: "Titles unlocked",
      });
    }
  };

  const handleClear = () => {
    if (isLocked) return;
    const emptyTitles = Array(4).fill('');
    setTitles(emptyTitles);
    localStorage.setItem('titleInput.titles', JSON.stringify(emptyTitles));
    toast({
      description: "All titles cleared!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <TitleDialogHeader
          isLocked={isLocked}
          onLockToggle={handleLockToggle}
          onClear={handleClear}
        />
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {titles.map((title, index) => (
              <TitleInput
                key={index}
                index={index}
                value={title}
                isLocked={isLocked}
                onChange={handleTitleChange}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}