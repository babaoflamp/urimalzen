import { create } from 'zustand';
import type { TOPIKQuestion, TOPIKTestSession, TOPIKProgress } from '../types';
import { topikAPI } from '../services/api';

interface TopikState {
  // Questions
  questions: TOPIKQuestion[];
  currentQuestion: TOPIKQuestion | null;
  currentQuestionIndex: number;

  // Test session
  currentSession: TOPIKTestSession | null;
  sessions: TOPIKTestSession[];

  // Progress
  progress: TOPIKProgress | null;

  // Filters
  selectedLevel: 1 | 2 | 3 | 4 | 5 | 6 | null;
  selectedSection: 'listening' | 'reading' | 'writing' | null;

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Actions - Setters
  setQuestions: (questions: TOPIKQuestion[]) => void;
  setCurrentQuestion: (question: TOPIKQuestion | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setCurrentSession: (session: TOPIKTestSession | null) => void;
  setSessions: (sessions: TOPIKTestSession[]) => void;
  setProgress: (progress: TOPIKProgress | null) => void;
  setSelectedLevel: (level: 1 | 2 | 3 | 4 | 5 | 6 | null) => void;
  setSelectedSection: (section: 'listening' | 'reading' | 'writing' | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Actions - Question operations
  fetchQuestions: (topikLevel?: 1 | 2 | 3 | 4 | 5 | 6, testSection?: 'listening' | 'reading' | 'writing') => Promise<void>;
  fetchQuestionsByLevel: (topikLevel: 1 | 2 | 3 | 4 | 5 | 6) => Promise<void>;
  fetchQuestionsBySection: (testSection: 'listening' | 'reading' | 'writing', topikLevel?: 1 | 2 | 3 | 4 | 5 | 6) => Promise<void>;
  nextQuestion: () => void;
  previousQuestion: () => void;

  // Actions - Session operations
  startSession: (testSection: 'listening' | 'reading' | 'writing', topikLevel: 1 | 2 | 3 | 4 | 5 | 6) => Promise<void>;
  submitAnswer: (questionId: string, userAnswer: string | number, timeSpent: number) => Promise<void>;
  completeSession: () => Promise<void>;
  fetchUserSessions: (status?: 'in-progress' | 'completed' | 'abandoned') => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;

  // Actions - Progress operations
  fetchProgress: () => Promise<void>;
  fetchProgressByLevel: (topikLevel: 1 | 2 | 3 | 4 | 5 | 6) => Promise<void>;

  // Reset
  resetState: () => void;
}

export const useTopikStore = create<TopikState>((set, get) => ({
  // Initial state
  questions: [],
  currentQuestion: null,
  currentQuestionIndex: 0,
  currentSession: null,
  sessions: [],
  progress: null,
  selectedLevel: null,
  selectedSection: null,
  isLoading: false,
  error: null,

  // Setters
  setQuestions: (questions) => set({ questions }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setCurrentQuestionIndex: (index) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      set({
        currentQuestionIndex: index,
        currentQuestion: questions[index],
      });
    }
  },
  setCurrentSession: (session) => set({ currentSession: session }),
  setSessions: (sessions) => set({ sessions }),
  setProgress: (progress) => set({ progress }),
  setSelectedLevel: (level) => set({ selectedLevel: level }),
  setSelectedSection: (section) => set({ selectedSection: section }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Question operations
  fetchQuestions: async (topikLevel, testSection) => {
    set({ isLoading: true, error: null });
    try {
      const response = await topikAPI.getAllQuestions(topikLevel, testSection);
      if (response.success && response.data) {
        set({
          questions: response.data,
          currentQuestion: response.data[0] || null,
          currentQuestionIndex: 0,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to fetch questions', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch questions', isLoading: false });
    }
  },

  fetchQuestionsByLevel: async (topikLevel) => {
    set({ isLoading: true, error: null });
    try {
      const response = await topikAPI.getQuestionsByLevel(topikLevel);
      if (response.success && response.data) {
        set({
          questions: response.data,
          currentQuestion: response.data[0] || null,
          currentQuestionIndex: 0,
          selectedLevel: topikLevel,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to fetch questions', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch questions', isLoading: false });
    }
  },

  fetchQuestionsBySection: async (testSection, topikLevel) => {
    set({ isLoading: true, error: null });
    try {
      const response = await topikAPI.getQuestionsBySection(testSection, topikLevel);
      if (response.success && response.data) {
        set({
          questions: response.data,
          currentQuestion: response.data[0] || null,
          currentQuestionIndex: 0,
          selectedSection: testSection,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to fetch questions', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch questions', isLoading: false });
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      set({
        currentQuestionIndex: newIndex,
        currentQuestion: questions[newIndex],
      });
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      set({
        currentQuestionIndex: newIndex,
        currentQuestion: questions[newIndex],
      });
    }
  },

  // Session operations
  startSession: async (testSection, topikLevel) => {
    set({ isLoading: true, error: null });
    try {
      const response = await topikAPI.startTestSession({ testSection, topikLevel });
      if (response.success && response.data) {
        set({
          currentSession: response.data,
          questions: response.data.questions,
          currentQuestion: response.data.questions[0] || null,
          currentQuestionIndex: 0,
          selectedLevel: topikLevel,
          selectedSection: testSection,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to start session', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to start session', isLoading: false });
    }
  },

  submitAnswer: async (questionId, userAnswer, timeSpent) => {
    const { currentSession } = get();
    if (!currentSession) {
      set({ error: 'No active session' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await topikAPI.submitAnswer(currentSession._id, {
        questionId,
        userAnswer,
        timeSpent,
      });
      if (response.success && response.data) {
        set({
          currentSession: response.data,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to submit answer', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to submit answer', isLoading: false });
    }
  },

  completeSession: async () => {
    const { currentSession } = get();
    if (!currentSession) {
      set({ error: 'No active session' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await topikAPI.completeSession(currentSession._id);
      if (response.success && response.data) {
        set({
          currentSession: response.data,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to complete session', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to complete session', isLoading: false });
    }
  },

  fetchUserSessions: async (status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await topikAPI.getUserSessions(status);
      if (response.success && response.data) {
        set({
          sessions: response.data,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to fetch sessions', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch sessions', isLoading: false });
    }
  },

  loadSession: async (sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await topikAPI.getSessionById(sessionId);
      if (response.success && response.data) {
        set({
          currentSession: response.data,
          questions: response.data.questions,
          currentQuestion: response.data.questions[0] || null,
          currentQuestionIndex: 0,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to load session', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to load session', isLoading: false });
    }
  },

  // Progress operations
  fetchProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await topikAPI.getProgress();
      if (response.success && response.data) {
        set({
          progress: response.data,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to fetch progress', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch progress', isLoading: false });
    }
  },

  fetchProgressByLevel: async (topikLevel) => {
    set({ isLoading: true, error: null });
    try {
      const response = await topikAPI.getProgressByLevel(topikLevel);
      if (response.success && response.data) {
        set({
          progress: response.data,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to fetch progress', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch progress', isLoading: false });
    }
  },

  // Reset
  resetState: () =>
    set({
      questions: [],
      currentQuestion: null,
      currentQuestionIndex: 0,
      currentSession: null,
      sessions: [],
      progress: null,
      selectedLevel: null,
      selectedSection: null,
      isLoading: false,
      error: null,
    }),
}));
