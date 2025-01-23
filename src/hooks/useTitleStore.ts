import { useState, useEffect } from 'react';

interface UseTitleStore {
  titles: string[];
  isLocked: boolean;
  setTitles: (titles: string[]) => void;
  setIsLocked: (locked: boolean) => void;
  loadTitles: () => void;
}

export const useTitleStore = (): UseTitleStore => {
  const [titles, setTitles] = useState<string[]>(() => {
    const saved = localStorage.getItem('titleInput.titles');
    return saved ? JSON.parse(saved) : Array(4).fill('');
  });

  const [isLocked, setIsLocked] = useState(() => {
    return localStorage.getItem('titleInput.isLocked') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('titleInput.titles', JSON.stringify(titles));
  }, [titles]);

  useEffect(() => {
    localStorage.setItem('titleInput.isLocked', isLocked.toString());
  }, [isLocked]);

  const loadTitles = () => {
    const saved = localStorage.getItem('textFeatures.titles');
    if (saved) {
      setTitles(JSON.parse(saved));
    }
  };

  return {
    titles,
    isLocked,
    setTitles,
    setIsLocked,
    loadTitles
  };
};