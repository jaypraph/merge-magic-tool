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

// Create a global event for title transfer
export const titleTransferEvent = new CustomEvent('transferTitles', {
  detail: { titles: [] as string[] }
}) as CustomEvent<{ titles: string[] }>;

export function TitleInputDialog({ open, onOpenChange }: TitleInputDialogProps) {
  const [titles, setTitles] = useState<string[]>(Array(4).fill(''));
  const [isLocked, setIsLocked] = useState(false);
  const { toast } = useToast();

  const handleTitleChange = (index: number, value: string) => {
    if (isLocked) return;
    const newTitles = [...titles];
    newTitles[index] = value;
    setTitles(newTitles);
  };

  const handleLockToggle = () => {
    setIsLocked(!isLocked);
    if (!isLocked) {
      // Filter out empty titles and transfer them
      const nonEmptyTitles = titles.filter(t => t.trim() !== '');
      titleTransferEvent.detail.titles = nonEmptyTitles;
      document.dispatchEvent(titleTransferEvent);
      
      // Save to localStorage
      localStorage.setItem('textFeatures.titles', JSON.stringify(nonEmptyTitles));
    }
    toast({
      description: isLocked ? "Titles unlocked" : "Titles locked",
    });
  };

  const handleClear = () => {
    if (isLocked) return;
    setTitles(Array(4).fill(''));
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