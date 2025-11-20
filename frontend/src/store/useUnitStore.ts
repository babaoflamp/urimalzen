import { create } from 'zustand';
import type { Unit, Lesson } from '../types';
import { unitAPI } from '../services/api';

interface UnitState {
  units: Unit[];
  currentUnit: Unit | null;
  currentLesson: Lesson | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUnits: (units: Unit[]) => void;
  setCurrentUnit: (unit: Unit | null) => void;
  setCurrentLesson: (lesson: Lesson | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Async operations
  fetchUnits: (kiipLevel?: number, category?: string) => Promise<void>;
  fetchUnitById: (id: string) => Promise<void>;
  fetchUnitByNumber: (unitNumber: number) => Promise<void>;
  fetchUnitsByLevel: (kiipLevel: number) => Promise<void>;
  fetchUnitsByCategory: (category: string, kiipLevel?: number) => Promise<void>;
  fetchUnitLessons: (unitId: string) => Promise<void>;
  fetchUnitLesson: (unitId: string, lessonNumber: number) => Promise<void>;
}

export const useUnitStore = create<UnitState>((set) => ({
  units: [],
  currentUnit: null,
  currentLesson: null,
  isLoading: false,
  error: null,

  setUnits: (units) => set({ units }),
  setCurrentUnit: (unit) => set({ currentUnit: unit }),
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchUnits: async (kiipLevel?: number, category?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await unitAPI.getAllUnits(kiipLevel, category);
      if (response.success && response.data) {
        set({ units: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch units', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch units', isLoading: false });
    }
  },

  fetchUnitById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await unitAPI.getUnitById(id);
      if (response.success && response.data) {
        set({ currentUnit: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch unit', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch unit', isLoading: false });
    }
  },

  fetchUnitByNumber: async (unitNumber: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await unitAPI.getUnitByNumber(unitNumber);
      if (response.success && response.data) {
        set({ currentUnit: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch unit', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch unit', isLoading: false });
    }
  },

  fetchUnitsByLevel: async (kiipLevel: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await unitAPI.getUnitsByLevel(kiipLevel);
      if (response.success && response.data) {
        set({ units: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch units', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch units', isLoading: false });
    }
  },

  fetchUnitsByCategory: async (category: string, kiipLevel?: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await unitAPI.getUnitsByCategory(category, kiipLevel);
      if (response.success && response.data) {
        set({ units: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch units', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch units', isLoading: false });
    }
  },

  fetchUnitLessons: async (unitId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await unitAPI.getUnitLessons(unitId);
      if (response.success && response.data) {
        // Update current unit with lessons
        const { currentUnit } = useUnitStore.getState();
        if (currentUnit && currentUnit._id === unitId) {
          set({
            currentUnit: { ...currentUnit, lessons: response.data },
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }
      } else {
        set({ error: 'Failed to fetch lessons', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch lessons', isLoading: false });
    }
  },

  fetchUnitLesson: async (unitId: string, lessonNumber: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await unitAPI.getUnitLesson(unitId, lessonNumber);
      if (response.success && response.data) {
        set({ currentLesson: response.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch lesson', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch lesson', isLoading: false });
    }
  },
}));
