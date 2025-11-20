import { create } from 'zustand';
import type { Category, CategoryStats } from '../types';
import { categoryAPI } from '../services/api';

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  categoryStats: CategoryStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCategories: (categories: Category[]) => void;
  setCurrentCategory: (category: Category | null) => void;
  setCategoryStats: (stats: CategoryStats | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Async operations
  fetchCategories: () => Promise<void>;
  fetchCategoryById: (id: string) => Promise<void>;
  fetchCategoryByName: (name: string) => Promise<void>;
  fetchCategoryStats: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  currentCategory: null,
  categoryStats: null,
  isLoading: false,
  error: null,

  setCategories: (categories) => set({ categories }),
  setCurrentCategory: (category) => set({ currentCategory: category }),
  setCategoryStats: (stats) => set({ categoryStats: stats }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryAPI.getAllCategories();
      if (response.success && response.data) {
        set({ categories: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch categories', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch categories', isLoading: false });
    }
  },

  fetchCategoryById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryAPI.getCategoryById(id);
      if (response.success && response.data) {
        set({ currentCategory: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch category', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch category', isLoading: false });
    }
  },

  fetchCategoryByName: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryAPI.getCategoryByName(name);
      if (response.success && response.data) {
        set({ currentCategory: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch category', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch category', isLoading: false });
    }
  },

  fetchCategoryStats: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryAPI.getCategoryStats(id);
      if (response.success && response.data) {
        set({ categoryStats: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch category stats', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch category stats', isLoading: false });
    }
  },
}));
