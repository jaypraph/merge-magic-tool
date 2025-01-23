import { create } from 'zustand';

interface TitleState {
  titles: string[];
  isLocked: boolean;
  setTitles: (titles: string[]) => void;
  setIsLocked: (locked: boolean) => void;
  clearTitles: () => void;
}

export const useTitleStore = create<TitleState>((set) => ({
  titles: Array(4).fill(''),
  isLocked: false,
  setTitles: (titles) => set({ titles }),
  setIsLocked: (isLocked) => {
    set({ isLocked });
    if (isLocked) {
      // When locking, save titles to localStorage for TXT dialog
      const currentState = useTitleStore.getState();
      localStorage.setItem('textFeatures.titles', JSON.stringify(currentState.titles));
      localStorage.setItem('textFeatures.titlesLocked', 'true');
    }
  },
  clearTitles: () => set({ titles: Array(4).fill('') })
}));