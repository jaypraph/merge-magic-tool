import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TitleDialogHeader } from "./TitleDialogHeader";
import { TitleInput } from "./TitleInput";
import { useTitleStore } from "@/hooks/useTitleStore";

interface TitleInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TitleInputDialog({ open, onOpenChange }: TitleInputDialogProps) {
  const { titles, isLocked, setTitles, setIsLocked } = useTitleStore();
  const { toast } = useToast();

  const handleTitleChange = (index: number, value: string) => {
    if (isLocked) return;
    const newTitles = [...titles];
    newTitles[index] = value;
    setTitles(newTitles);
  };

  const handleLockToggle = () => {
    const newLockedState = !isLocked;
    setIsLocked(newLockedState);
    
    if (newLockedState) {
      // Copy titles to TextFeatures
      localStorage.setItem('textFeatures.titles', JSON.stringify(titles));
      localStorage.setItem('textFeatures.titlesLocked', 'true');
      
      toast({
        description: "Titles locked and copied to Text Features",
      });
    } else {
      toast({
        description: "Titles unlocked",
      });
    }
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