import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KeywordsSection } from "./text-features/KeywordsSection";
import { TitleSection } from "./text-features/TitleSection";
import { DescriptionSection } from "./text-features/DescriptionSection";

interface TextFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TextFeaturesDialog({ open, onOpenChange }: TextFeaturesDialogProps) {
  // Keywords state with localStorage persistence
  const [keywords, setKeywords] = useState<string[]>(() => {
    const savedKeywords = localStorage.getItem('textFeatures.keywords');
    return savedKeywords ? JSON.parse(savedKeywords) : Array(13).fill('');
  });
  
  const [keywordsLocked, setKeywordsLocked] = useState(() => {
    return localStorage.getItem('textFeatures.keywordsLocked') === 'true';
  });
  
  // Title state with localStorage persistence
  const [titleAreas, setTitleAreas] = useState<string[]>(() => {
    const savedTitles = localStorage.getItem('textFeatures.titles');
    return savedTitles ? JSON.parse(savedTitles) : Array(4).fill('');
  });
  const [titlesLocked, setTitlesLocked] = useState(false);
  
  // Description state
  const [descriptionAreas, setDescriptionAreas] = useState<string[]>(Array(4).fill(''));
  const [descriptionsLocked, setDescriptionsLocked] = useState(false);
  
  const { toast } = useToast();

  // Persist keywords and lock state to localStorage
  useEffect(() => {
    localStorage.setItem('textFeatures.keywords', JSON.stringify(keywords));
  }, [keywords]);

  useEffect(() => {
    localStorage.setItem('textFeatures.keywordsLocked', keywordsLocked.toString());
  }, [keywordsLocked]);

  const handleKeywordChange = (index: number, value: string) => {
    if (keywordsLocked) return;
    if (value.length <= 20) {
      const newKeywords = [...keywords];
      newKeywords[index] = value;
      setKeywords(newKeywords);
    }
  };

  const handleTitleChange = (index: number, value: string) => {
    if (titlesLocked) return;
    const newTitles = [...titleAreas];
    newTitles[index] = value;
    setTitleAreas(newTitles);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    if (descriptionsLocked) return;
    const newDescriptions = [...descriptionAreas];
    newDescriptions[index] = value;
    setDescriptionAreas(newDescriptions);
  };

  useEffect(() => {
    const handleKeywordTransfer = (event: Event) => {
      const customEvent = event as CustomEvent<{ keywords: string[] }>;
      const transferredKeywords = customEvent.detail.keywords;
      const newKeywords = Array(13).fill('');
      transferredKeywords.forEach((keyword, index) => {
        if (index < 13) {
          newKeywords[index] = keyword;
        }
      });
      setKeywords(newKeywords);
    };

    const handleTitleTransfer = (event: Event) => {
      const customEvent = event as CustomEvent<{ titles: string[] }>;
      const transferredTitles = customEvent.detail.titles;
      const newTitles = Array(4).fill('');
      transferredTitles.forEach((title, index) => {
        if (index < 4) {
          newTitles[index] = title;
        }
      });
      setTitleAreas(newTitles);
      setTitlesLocked(true);
      toast({
        description: "Titles transferred and locked",
      });
    };

    document.addEventListener('transferKeywords', handleKeywordTransfer);
    document.addEventListener('transferTitles', handleTitleTransfer);
    
    return () => {
      document.removeEventListener('transferKeywords', handleKeywordTransfer);
      document.removeEventListener('transferTitles', handleTitleTransfer);
    };
  }, [toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">Text Features</DialogTitle>
        <DialogDescription className="sr-only">
          Manage your keywords, titles, and descriptions
        </DialogDescription>
        <ScrollArea className="h-full pr-4" style={{ scrollbarGutter: 'stable' }}>
          <div className="grid grid-cols-3 gap-4 p-4">
            <KeywordsSection
              keywords={keywords}
              isLocked={keywordsLocked}
              onKeywordChange={handleKeywordChange}
              onLockToggle={() => {
                setKeywordsLocked(!keywordsLocked);
                toast({
                  description: keywordsLocked ? "Keywords unlocked" : "Keywords locked",
                });
              }}
            />
            <TitleSection
              titles={titleAreas}
              isLocked={titlesLocked}
              onTitleChange={handleTitleChange}
              onLockToggle={() => {
                setTitlesLocked(!titlesLocked);
                toast({
                  description: titlesLocked ? "Titles unlocked" : "Titles locked",
                });
              }}
            />
            <DescriptionSection
              descriptions={descriptionAreas}
              isLocked={descriptionsLocked}
              onDescriptionChange={handleDescriptionChange}
              onLockToggle={() => {
                setDescriptionsLocked(!descriptionsLocked);
                toast({
                  description: descriptionsLocked ? "Descriptions unlocked" : "Descriptions locked",
                });
              }}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}