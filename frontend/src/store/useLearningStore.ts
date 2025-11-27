import { create } from 'zustand';
import type { Word, UserProgress, Ranking } from '../types';
import { wordAPI } from '../services/api';

interface LearningState {
  words: Word[];
  filteredWords: Word[];
  currentWordIndex: number;
  currentWord: Word | null;
  userProgress: UserProgress[];
  ranking: Ranking | null;
  isRecording: boolean;
  isLoading: boolean;
  error: string | null;

  // Filter state
  selectedKiipLevel: number | null;
  selectedCategory: string | null;
  searchQuery: string;

  // Basic setters
  setWords: (words: Word[]) => void;
  setFilteredWords: (words: Word[]) => void;
  setCurrentWordIndex: (index: number) => void;
  setCurrentWord: (word: Word | null) => void;
  setUserProgress: (progress: UserProgress[]) => void;
  setRanking: (ranking: Ranking) => void;
  setIsRecording: (isRecording: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Filter setters
  setSelectedKiipLevel: (level: number | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;

  // Navigation
  nextWord: () => void;
  previousWord: () => void;
  goToWord: (order: number) => void;

  // Filter operations
  applyFilters: () => void;
  clearFilters: () => void;

  // Async operations
  fetchWordsByLevel: (kiipLevel: number) => Promise<void>;
  fetchWordsByCategory: (category: string, kiipLevel?: number) => Promise<void>;
  searchWords: (query: string) => Promise<void>;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  words: [],
  filteredWords: [],
  currentWordIndex: 0,
  currentWord: null,
  userProgress: [],
  ranking: null,
  isRecording: false,
  isLoading: false,
  error: null,

  // Filter state
  selectedKiipLevel: null,
  selectedCategory: null,
  searchQuery: '',

  // Basic setters
  setWords: (words) => set({ words, filteredWords: words }),

  setFilteredWords: (words) => set({ filteredWords: words }),

  setCurrentWordIndex: (index) => {
    const { filteredWords } = get();
    set({
      currentWordIndex: index,
      currentWord: filteredWords[index] || null,
    });
  },

  setCurrentWord: (word) => set({ currentWord: word }),

  setUserProgress: (progress) => set({ userProgress: progress }),

  setRanking: (ranking) => set({ ranking }),

  setIsRecording: (isRecording) => set({ isRecording }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // Filter setters
  setSelectedKiipLevel: (level) => {
    set({ selectedKiipLevel: level });
    get().applyFilters();
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().applyFilters();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    if (query.trim()) {
      get().searchWords(query);
    } else {
      get().applyFilters();
    }
  },

  // Navigation
  nextWord: () => {
    const { filteredWords, currentWordIndex } = get();
    const nextIndex = Math.min(currentWordIndex + 1, filteredWords.length - 1);
    set({
      currentWordIndex: nextIndex,
      currentWord: filteredWords[nextIndex] || null,
    });
  },

  previousWord: () => {
    const { filteredWords, currentWordIndex } = get();
    const prevIndex = Math.max(currentWordIndex - 1, 0);
    set({
      currentWordIndex: prevIndex,
      currentWord: filteredWords[prevIndex] || null,
    });
  },

  goToWord: (order) => {
    const { filteredWords } = get();
    const index = filteredWords.findIndex((w) => w.order === order);
    if (index !== -1) {
      set({
        currentWordIndex: index,
        currentWord: filteredWords[index],
      });
    }
  },

  // Filter operations
  applyFilters: () => {
    const { words, selectedKiipLevel, selectedCategory } = get();
    let filtered = [...words];

    if (selectedKiipLevel !== null) {
      filtered = filtered.filter((w) => w.level?.kiip === selectedKiipLevel);
    }

    if (selectedCategory) {
      filtered = filtered.filter((w) => w.mainCategory === selectedCategory);
    }

    set({
      filteredWords: filtered,
      currentWordIndex: 0,
      currentWord: filtered[0] || null,
    });
  },

  clearFilters: () => {
    const { words } = get();
    set({
      selectedKiipLevel: null,
      selectedCategory: null,
      searchQuery: '',
      filteredWords: words,
      currentWordIndex: 0,
      currentWord: words[0] || null,
      error: null,
    });
  },

  // Async operations
  fetchWordsByLevel: async (kiipLevel: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await wordAPI.getWordsByLevel(kiipLevel);
      if (response.success && response.data) {
        set({
          words: response.data,
          filteredWords: response.data,
          currentWordIndex: 0,
          currentWord: response.data[0] || null,
          selectedKiipLevel: kiipLevel,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to fetch words', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch words', isLoading: false });
    }
  },

  fetchWordsByCategory: async (category: string, kiipLevel?: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await wordAPI.getWordsByCategory(category, kiipLevel);
      if (response.success && response.data) {
        set({
          words: response.data,
          filteredWords: response.data,
          currentWordIndex: 0,
          currentWord: response.data[0] || null,
          selectedCategory: category,
          selectedKiipLevel: kiipLevel || null,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to fetch words', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch words', isLoading: false });
    }
  },

  searchWords: async (query: string) => {
    if (!query.trim()) {
      get().clearFilters();
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await wordAPI.searchWords(query);
      if (response.success && response.data) {
        set({
          filteredWords: response.data,
          currentWordIndex: 0,
          currentWord: response.data[0] || null,
          searchQuery: query,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to search words', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to search words', isLoading: false });
    }
  },
}));
