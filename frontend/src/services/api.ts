import axios from 'axios';
import type {
  AuthResponse,
  Word,
  UserProgress,
  Recording,
  Ranking,
  Category,
  CategoryStats,
  PhonemeRule,
  PronunciationAnalysis,
  Unit,
  ApiResponse,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
    region?: string;
    country?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Word API
export const wordAPI = {
  getAllWords: async (): Promise<{ success: boolean; count: number; data: Word[] }> => {
    const response = await api.get('/words');
    return response.data;
  },

  getWordById: async (id: string): Promise<{ success: boolean; data: Word }> => {
    const response = await api.get(`/words/${id}`);
    return response.data;
  },

  getWordByOrder: async (order: number): Promise<{ success: boolean; data: Word }> => {
    const response = await api.get(`/words/order/${order}`);
    return response.data;
  },

  getWordsByLevel: async (
    kiipLevel: number
  ): Promise<{ success: boolean; kiipLevel: number; count: number; data: Word[] }> => {
    const response = await api.get(`/words/level/${kiipLevel}`);
    return response.data;
  },

  getWordsByCategory: async (
    category: string,
    kiipLevel?: number
  ): Promise<{ success: boolean; category: string; count: number; data: Word[] }> => {
    const response = await api.get(`/words/category/${category}`, {
      params: kiipLevel !== undefined ? { kiipLevel } : {},
    });
    return response.data;
  },

  getWordsByCriteria: async (params: {
    kiipLevel?: number;
    cefrLevel?: string;
    category?: string;
    subCategory?: string;
    minDifficulty?: number;
    maxDifficulty?: number;
    wordType?: string;
  }): Promise<{ success: boolean; filters: any; count: number; data: Word[] }> => {
    const response = await api.get('/words/search', { params });
    return response.data;
  },

  searchWords: async (
    query: string
  ): Promise<{ success: boolean; query: string; count: number; data: Word[] }> => {
    const response = await api.get('/words/search/text', { params: { q: query } });
    return response.data;
  },
};

// Recording API
export const recordingAPI = {
  uploadRecording: async (data: FormData): Promise<{ success: boolean; data: Recording }> => {
    const response = await api.post('/recordings', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getRecordingsByWord: async (
    wordId: string
  ): Promise<{ success: boolean; count: number; data: Recording[] }> => {
    const response = await api.get(`/recordings/word/${wordId}`);
    return response.data;
  },

  getAllRecordings: async (): Promise<{ success: boolean; count: number; data: Recording[] }> => {
    const response = await api.get('/recordings');
    return response.data;
  },
};

// Progress API
export const progressAPI = {
  getUserProgress: async (): Promise<{ success: boolean; count: number; data: UserProgress[] }> => {
    const response = await api.get('/progress');
    return response.data;
  },

  updateProgress: async (data: {
    wordId: string;
    completed?: boolean;
    score?: number;
  }): Promise<{ success: boolean; data: UserProgress; totalScore: number }> => {
    const response = await api.post('/progress', data);
    return response.data;
  },
};

// Ranking API
export const rankingAPI = {
  getUserRanking: async (): Promise<{ success: boolean; data: Ranking }> => {
    const response = await api.get('/rankings/me');
    return response.data;
  },

  getGlobalRankings: async (
    limit?: number
  ): Promise<{ success: boolean; count: number; data: Ranking[] }> => {
    const response = await api.get('/rankings/global', { params: { limit } });
    return response.data;
  },

  getCountryRankings: async (
    country: string,
    limit?: number
  ): Promise<{ success: boolean; country: string; count: number; data: Ranking[] }> => {
    const response = await api.get(`/rankings/country/${country}`, { params: { limit } });
    return response.data;
  },

  getRegionRankings: async (
    region: string,
    limit?: number
  ): Promise<{ success: boolean; region: string; count: number; data: Ranking[] }> => {
    const response = await api.get(`/rankings/region/${region}`, { params: { limit } });
    return response.data;
  },
};

// Category API
export const categoryAPI = {
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategoryById: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  getCategoryByName: async (name: string): Promise<ApiResponse<Category>> => {
    const response = await api.get(`/categories/name/${name}`);
    return response.data;
  },

  getWordsByCategory: async (
    id: string,
    kiipLevel?: number,
    subCategory?: string
  ): Promise<{ success: boolean; category: string; count: number; data: Word[] }> => {
    const params: any = {};
    if (kiipLevel !== undefined) params.kiipLevel = kiipLevel;
    if (subCategory) params.subCategory = subCategory;
    const response = await api.get(`/categories/${id}/words`, { params });
    return response.data;
  },

  getCategoryStats: async (id: string): Promise<ApiResponse<CategoryStats>> => {
    const response = await api.get(`/categories/${id}/stats`);
    return response.data;
  },

  // Admin operations
  createCategory: async (data: Partial<Category>): Promise<ApiResponse<Category>> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<ApiResponse<Category>> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// Pronunciation API
export const pronunciationAPI = {
  getAllPhonemeRules: async (kiipLevel?: number): Promise<ApiResponse<PhonemeRule[]>> => {
    const params = kiipLevel !== undefined ? { kiipLevel } : {};
    const response = await api.get('/pronunciation/rules', { params });
    return response.data;
  },

  getPhonemeRuleById: async (id: string): Promise<ApiResponse<PhonemeRule>> => {
    const response = await api.get(`/pronunciation/rules/${id}`);
    return response.data;
  },

  getPhonemeRuleByName: async (ruleName: string): Promise<ApiResponse<PhonemeRule>> => {
    const response = await api.get(`/pronunciation/rules/name/${ruleName}`);
    return response.data;
  },

  analyzeWord: async (word: string): Promise<ApiResponse<PronunciationAnalysis>> => {
    const response = await api.post('/pronunciation/analyze', { word });
    return response.data;
  },

  // Admin operations
  createPhonemeRule: async (data: Partial<PhonemeRule>): Promise<ApiResponse<PhonemeRule>> => {
    const response = await api.post('/pronunciation/rules', data);
    return response.data;
  },

  updatePhonemeRule: async (
    id: string,
    data: Partial<PhonemeRule>
  ): Promise<ApiResponse<PhonemeRule>> => {
    const response = await api.put(`/pronunciation/rules/${id}`, data);
    return response.data;
  },

  deletePhonemeRule: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/pronunciation/rules/${id}`);
    return response.data;
  },
};

// Unit API
export const unitAPI = {
  getAllUnits: async (
    kiipLevel?: number,
    category?: string
  ): Promise<ApiResponse<Unit[]>> => {
    const params: any = {};
    if (kiipLevel !== undefined) params.kiipLevel = kiipLevel;
    if (category) params.category = category;
    const response = await api.get('/units', { params });
    return response.data;
  },

  getUnitById: async (id: string): Promise<ApiResponse<Unit>> => {
    const response = await api.get(`/units/${id}`);
    return response.data;
  },

  getUnitByNumber: async (unitNumber: number): Promise<ApiResponse<Unit>> => {
    const response = await api.get(`/units/number/${unitNumber}`);
    return response.data;
  },

  getUnitsByLevel: async (
    kiipLevel: number
  ): Promise<{ success: boolean; kiipLevel: number; count: number; data: Unit[] }> => {
    const response = await api.get(`/units/level/${kiipLevel}`);
    return response.data;
  },

  getUnitsByCategory: async (
    category: string,
    kiipLevel?: number
  ): Promise<{ success: boolean; category: string; count: number; data: Unit[] }> => {
    const params = kiipLevel !== undefined ? { kiipLevel } : {};
    const response = await api.get(`/units/category/${category}`, { params });
    return response.data;
  },

  getUnitLessons: async (
    unitId: string
  ): Promise<{ success: boolean; unitNumber: number; unitTitle: string; lessonCount: number; data: any[] }> => {
    const response = await api.get(`/units/${unitId}/lessons`);
    return response.data;
  },

  getUnitLesson: async (
    unitId: string,
    lessonNumber: number
  ): Promise<ApiResponse<any>> => {
    const response = await api.get(`/units/${unitId}/lessons/${lessonNumber}`);
    return response.data;
  },

  // Admin operations
  createUnit: async (data: Partial<Unit>): Promise<ApiResponse<Unit>> => {
    const response = await api.post('/units', data);
    return response.data;
  },

  updateUnit: async (id: string, data: Partial<Unit>): Promise<ApiResponse<Unit>> => {
    const response = await api.put(`/units/${id}`, data);
    return response.data;
  },

  deleteUnit: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/units/${id}`);
    return response.data;
  },

  addLessonToUnit: async (unitId: string, lessonData: any): Promise<ApiResponse<Unit>> => {
    const response = await api.post(`/units/${unitId}/lessons`, lessonData);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getStats: async (): Promise<{
    totalUsers: number;
    totalWords: number;
    totalRecordings: number;
    activeUsers: number;
  }> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (page = 1, limit = 20) => {
    const response = await api.get('/admin/users', { params: { page, limit } });
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUserAdmin: async (id: string, isAdmin: boolean) => {
    const response = await api.patch(`/admin/users/${id}/admin`, { isAdmin });
    return response.data;
  },

  getWords: async () => {
    const response = await api.get('/admin/words');
    return response.data;
  },

  createWord: async (data: Partial<Word>) => {
    const response = await api.post('/admin/words', data);
    return response.data;
  },

  updateWord: async (id: string, data: Partial<Word>) => {
    const response = await api.put(`/admin/words/${id}`, data);
    return response.data;
  },

  deleteWord: async (id: string) => {
    const response = await api.delete(`/admin/words/${id}`);
    return response.data;
  },

  getRecordings: async (page = 1, limit = 50) => {
    const response = await api.get('/admin/recordings', { params: { page, limit } });
    return response.data;
  },
};

export default api;
