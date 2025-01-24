import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KeywordsSection } from "./text-features/KeywordsSection";
import { TitleSection } from "./text-features/TitleSection";
import { DescriptionSection } from "./text-features/DescriptionSection";

interface TextFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TextFeaturesDialog({ open, onOpenChange }: TextFeaturesDialogProps) {
  const [keywords, setKeywords] = useState<string[]>(() => {
    const savedKeywords = localStorage.getItem('textFeatures.keywords');
    return savedKeywords ? JSON.parse(savedKeywords) : Array(13).fill('');
  });
  
  const [keywordsLocked, setKeywordsLocked] = useState(() => {
    return localStorage.getItem('textFeatures.keywordsLocked') === 'true';
  });
  
  const [titleAreas, setTitleAreas] = useState<string[]>(() => {
    const savedTitles = localStorage.getItem('textFeatures.titles');
    return savedTitles ? JSON.parse(savedTitles) : Array(4).fill('');
  });
  
  const [titlesLocked, setTitlesLocked] = useState(() => {
    return localStorage.getItem('textFeatures.titlesLocked') === 'true';
  });
  
  const [descriptionAreas, setDescriptionAreas] = useState<string[]>(Array(4).fill(''));
  const [descriptionsLocked, setDescriptionsLocked] = useState(false);

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem('textFeatures.keywords', JSON.stringify(keywords));
  }, [keywords]);

  useEffect(() => {
    localStorage.setItem('textFeatures.keywordsLocked', keywordsLocked.toString());
  }, [keywordsLocked]);

  // Load titles when dialog opens
  useEffect(() => {
    if (open) {
      const savedTitles = localStorage.getItem('textFeatures.titles');
      if (savedTitles) {
        setTitleAreas(JSON.parse(savedTitles));
        setTitlesLocked(localStorage.getItem('textFeatures.titlesLocked') === 'true');
      }
    }
  }, [open]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">Text Features</DialogTitle>
        <ScrollArea className="h-full pr-4" style={{ scrollbarGutter: 'stable' }}>
          <div className="grid grid-cols-3 gap-4 p-4">
            <KeywordsSection
              keywords={keywords}
              isLocked={keywordsLocked}
              onLockToggle={() => setKeywordsLocked(!keywordsLocked)}
              onChange={handleKeywordChange}
            />
            <TitleSection
              titles={titleAreas}
              isLocked={titlesLocked}
              onLockToggle={() => setTitlesLocked(!titlesLocked)}
              onChange={handleTitleChange}
            />
            <DescriptionSection
              descriptions={descriptionAreas}
              isLocked={descriptionsLocked}
              onLockToggle={() => setDescriptionsLocked(!descriptionsLocked)}
              onChange={handleDescriptionChange}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}