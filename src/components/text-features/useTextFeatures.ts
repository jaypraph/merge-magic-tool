import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useTextFeatures() {
  const [syncEnabled, setSyncEnabled] = useState(() => {
    return localStorage.getItem('textFeatures.syncEnabled') === 'true';
  });

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
  
  const [descriptionAreas, setDescriptionAreas] = useState<string[]>(() => {
    const savedDescriptions = localStorage.getItem('textFeatures.descriptions');
    return savedDescriptions ? JSON.parse(savedDescriptions) : Array(4).fill('');
  });
  
  const [descriptionsLocked, setDescriptionsLocked] = useState(() => {
    return localStorage.getItem('textFeatures.descriptionsLocked') === 'true';
  });

  const { toast } = useToast();

  const isAnyUnlocked = !keywordsLocked || !titlesLocked || !descriptionsLocked;

  const handleLockAll = () => {
    if (isAnyUnlocked) {
      setKeywordsLocked(true);
      setTitlesLocked(true);
      setDescriptionsLocked(true);
      toast({
        description: "All sections locked",
      });
    } else {
      setKeywordsLocked(false);
      setTitlesLocked(false);
      setDescriptionsLocked(false);
      toast({
        description: "All sections unlocked",
      });
    }
  };

  const clearAll = () => {
    if (!keywordsLocked) {
      setKeywords(Array(13).fill(''));
    }
    if (!titlesLocked) {
      setTitleAreas(Array(4).fill(''));
    }
    if (!descriptionsLocked) {
      setDescriptionAreas(Array(4).fill(''));
    }
    toast({
      description: "All unlocked text areas have been cleared!",
    });
  };

  // Add event listener for keyword transfer
  useEffect(() => {
    const handleKeywordTransfer = (event: CustomEvent<{ keywords: string[] }>) => {
      if (!keywordsLocked) {
        const newKeywords = [...event.detail.keywords];
        while (newKeywords.length < 13) {
          newKeywords.push('');
        }
        setKeywords(newKeywords);
        toast({
          description: "Keywords transferred successfully!",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Keywords are locked. Unlock them first to transfer new keywords.",
        });
      }
    };

    document.addEventListener('transferKeywords', handleKeywordTransfer as EventListener);
    return () => {
      document.removeEventListener('transferKeywords', handleKeywordTransfer as EventListener);
    };
  }, [keywordsLocked, toast]);

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem('textFeatures.syncEnabled', syncEnabled.toString());
  }, [syncEnabled]);

  useEffect(() => {
    if (syncEnabled && !descriptionsLocked) {
      setDescriptionAreas(titleAreas);
    }
  }, [syncEnabled, titleAreas, descriptionsLocked]);

  useEffect(() => {
    localStorage.setItem('textFeatures.keywords', JSON.stringify(keywords));
  }, [keywords]);

  useEffect(() => {
    localStorage.setItem('textFeatures.keywordsLocked', keywordsLocked.toString());
  }, [keywordsLocked]);

  useEffect(() => {
    localStorage.setItem('textFeatures.titles', JSON.stringify(titleAreas));
  }, [titleAreas]);

  useEffect(() => {
    localStorage.setItem('textFeatures.descriptions', JSON.stringify(descriptionAreas));
  }, [descriptionAreas]);

  useEffect(() => {
    localStorage.setItem('textFeatures.descriptionsLocked', descriptionsLocked.toString());
  }, [descriptionsLocked]);

  return {
    syncEnabled,
    setSyncEnabled,
    keywords,
    setKeywords,
    keywordsLocked,
    setKeywordsLocked,
    titleAreas,
    setTitleAreas,
    titlesLocked,
    setTitlesLocked,
    descriptionAreas,
    setDescriptionAreas,
    descriptionsLocked,
    setDescriptionsLocked,
    clearAll,
    isAnyUnlocked,
    handleLockAll,
    toast
  };
}