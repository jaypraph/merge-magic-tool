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
  
  const [titlesLocked, setTitlesLocked] = useState(false);
  
  const [descriptionAreas, setDescriptionAreas] = useState<string[]>(() => {
    const savedDescriptions = localStorage.getItem('textFeatures.descriptions');
    return savedDescriptions ? JSON.parse(savedDescriptions) : Array(4).fill('');
  });
  
  const [descriptionsLocked, setDescriptionsLocked] = useState(() => {
    return localStorage.getItem('textFeatures.descriptionsLocked') === 'true';
  });

  const { toast } = useToast();

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
    toast
  };
}