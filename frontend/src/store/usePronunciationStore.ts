import { create } from 'zustand';
import type { PhonemeRule, PronunciationAnalysis } from '../types';
import { pronunciationAPI } from '../services/api';

interface PronunciationState {
  phonemeRules: PhonemeRule[];
  currentRule: PhonemeRule | null;
  analysisResult: PronunciationAnalysis | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setPhonemeRules: (rules: PhonemeRule[]) => void;
  setCurrentRule: (rule: PhonemeRule | null) => void;
  setAnalysisResult: (result: PronunciationAnalysis | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Async operations
  fetchPhonemeRules: (kiipLevel?: number) => Promise<void>;
  fetchPhonemeRuleById: (id: string) => Promise<void>;
  fetchPhonemeRuleByName: (ruleName: string) => Promise<void>;
  analyzeWord: (word: string) => Promise<void>;
  clearAnalysis: () => void;
}

export const usePronunciationStore = create<PronunciationState>((set) => ({
  phonemeRules: [],
  currentRule: null,
  analysisResult: null,
  isLoading: false,
  error: null,

  setPhonemeRules: (rules) => set({ phonemeRules: rules }),
  setCurrentRule: (rule) => set({ currentRule: rule }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchPhonemeRules: async (kiipLevel?: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await pronunciationAPI.getAllPhonemeRules(kiipLevel);
      if (response.success && response.data) {
        set({ phonemeRules: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch phoneme rules', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch phoneme rules', isLoading: false });
    }
  },

  fetchPhonemeRuleById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await pronunciationAPI.getPhonemeRuleById(id);
      if (response.success && response.data) {
        set({ currentRule: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch phoneme rule', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch phoneme rule', isLoading: false });
    }
  },

  fetchPhonemeRuleByName: async (ruleName: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await pronunciationAPI.getPhonemeRuleByName(ruleName);
      if (response.success && response.data) {
        set({ currentRule: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch phoneme rule', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch phoneme rule', isLoading: false });
    }
  },

  analyzeWord: async (word: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await pronunciationAPI.analyzeWord(word);
      if (response.success && response.data) {
        set({ analysisResult: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to analyze word', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to analyze word', isLoading: false });
    }
  },

  clearAnalysis: () => set({ analysisResult: null, error: null }),
}));
