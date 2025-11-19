import { create } from 'zustand';
import type { Word, UserProgress, Ranking } from '../types';

interface LearningState {
  words: Word[];
  currentWordIndex: number;
  currentWord: Word | null;
  userProgress: UserProgress[];
  ranking: Ranking | null;
  isRecording: boolean;

  setWords: (words: Word[]) => void;
  setCurrentWordIndex: (index: number) => void;
  setCurrentWord: (word: Word | null) => void;
  setUserProgress: (progress: UserProgress[]) => void;
  setRanking: (ranking: Ranking) => void;
  setIsRecording: (isRecording: boolean) => void;

  nextWord: () => void;
  previousWord: () => void;
  goToWord: (order: number) => void;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  words: [],
  currentWordIndex: 0,
  currentWord: null,
  userProgress: [],
  ranking: null,
  isRecording: false,

  setWords: (words) => set({ words }),

  setCurrentWordIndex: (index) => {
    const { words } = get();
    set({
      currentWordIndex: index,
      currentWord: words[index] || null,
    });
  },

  setCurrentWord: (word) => set({ currentWord: word }),

  setUserProgress: (progress) => set({ userProgress: progress }),

  setRanking: (ranking) => set({ ranking }),

  setIsRecording: (isRecording) => set({ isRecording }),

  nextWord: () => {
    const { words, currentWordIndex } = get();
    const nextIndex = Math.min(currentWordIndex + 1, words.length - 1);
    set({
      currentWordIndex: nextIndex,
      currentWord: words[nextIndex] || null,
    });
  },

  previousWord: () => {
    const { words, currentWordIndex } = get();
    const prevIndex = Math.max(currentWordIndex - 1, 0);
    set({
      currentWordIndex: prevIndex,
      currentWord: words[prevIndex] || null,
    });
  },

  goToWord: (order) => {
    const { words } = get();
    const index = words.findIndex((w) => w.order === order);
    if (index !== -1) {
      set({
        currentWordIndex: index,
        currentWord: words[index],
      });
    }
  },
}));
