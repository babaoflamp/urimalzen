import { create } from 'zustand';

type Language = 'ko' | 'mn' | 'zh';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'ko',
  setLanguage: (lang) => set({ language: lang }),
}));
