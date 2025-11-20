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

// Admin AI API
export const adminAIAPI = {
  generateDescription: async (wordId: string, language?: string) => {
    const response = await api.post('/admin/ai/generate-description', { wordId, language });
    return response.data;
  },

  generateExamples: async (wordId: string, count = 3) => {
    const response = await api.post('/admin/ai/generate-examples', { wordId, count });
    return response.data;
  },

  generatePronunciationTips: async (wordId: string) => {
    const response = await api.post('/admin/ai/generate-pronunciation-tips', { wordId });
    return response.data;
  },

  generateFullContent: async (wordId: string) => {
    const response = await api.post('/admin/ai/generate-full-content', { wordId });
    return response.data;
  },

  generateLessonContent: async (unitId: string, lessonNumber: number) => {
    const response = await api.post('/admin/ai/generate-lesson-content', { unitId, lessonNumber });
    return response.data;
  },

  batchGenerate: async (wordIds: string[], contentType = 'full') => {
    const response = await api.post('/admin/ai/batch-generate', { wordIds, contentType });
    return response.data;
  },

  testConnection: async () => {
    const response = await api.get('/admin/ai/test-connection');
    return response.data;
  },
};

// Admin TTS API
export const adminTTSAPI = {
  generateWordAudio: async (wordId: string, options?: { voice?: string; speed?: number; pitch?: number }) => {
    const response = await api.post('/admin/tts/generate-word-audio', { wordId, ...options });
    return response.data;
  },

  generateExampleAudio: async (wordId: string, exampleIndex: number, options?: { voice?: string; speed?: number; pitch?: number }) => {
    const response = await api.post('/admin/tts/generate-example-audio', { wordId, exampleIndex, ...options });
    return response.data;
  },

  generatePhonemeAudio: async (ruleId: string, exampleIndex: number, options?: { voice?: string; speed?: number; pitch?: number }) => {
    const response = await api.post('/admin/tts/generate-phoneme-audio', { ruleId, exampleIndex, ...options });
    return response.data;
  },

  batchGenerate: async (wordIds: string[], audioType = 'word', options?: { voice?: string; speed?: number; pitch?: number }) => {
    const response = await api.post('/admin/tts/batch-generate', { wordIds, audioType, ...options });
    return response.data;
  },

  getAllAudio: async (page = 1, limit = 20, audioType?: string) => {
    const response = await api.get('/admin/tts/audio', { params: { page, limit, audioType } });
    return response.data;
  },

  getWordAudio: async (wordId: string) => {
    const response = await api.get(`/admin/tts/word-audio/${wordId}`);
    return response.data;
  },

  deleteAudio: async (audioId: string) => {
    const response = await api.delete(`/admin/tts/audio/${audioId}`);
    return response.data;
  },

  testConnection: async () => {
    const response = await api.get('/admin/tts/test-connection');
    return response.data;
  },
};

// Admin STT API
export const adminSTTAPI = {
  getAllEvaluations: async (page = 1, limit = 20, userId?: string, wordId?: string) => {
    const response = await api.get('/admin/stt/evaluations', { params: { page, limit, userId, wordId } });
    return response.data;
  },

  getEvaluationById: async (id: string) => {
    const response = await api.get(`/admin/stt/evaluations/${id}`);
    return response.data;
  },

  getStats: async (userId?: string, wordId?: string) => {
    const response = await api.get('/admin/stt/stats', { params: { userId, wordId } });
    return response.data;
  },

  reEvaluate: async (recordingId: string) => {
    const response = await api.post('/admin/stt/re-evaluate', { recordingId });
    return response.data;
  },

  deleteEvaluation: async (id: string) => {
    const response = await api.delete(`/admin/stt/evaluations/${id}`);
    return response.data;
  },

  testConnection: async () => {
    const response = await api.get('/admin/stt/test-connection');
    return response.data;
  },
};

// User TTS API
export const ttsAPI = {
  getWordAudio: async (wordId: string) => {
    const response = await api.get(`/tts/word/${wordId}`);
    return response.data;
  },

  getExampleAudio: async (wordId: string, exampleIndex: number) => {
    const response = await api.get(`/tts/example/${wordId}/${exampleIndex}`);
    return response.data;
  },

  getAllWordAudio: async (wordId: string) => {
    const response = await api.get(`/tts/word-all/${wordId}`);
    return response.data;
  },

  generateRealTime: async (text: string, options?: { voice?: string; speed?: number; pitch?: number }) => {
    const response = await api.post('/tts/generate', { text, ...options });
    return response.data;
  },
};

// User STT API
export const sttAPI = {
  evaluatePronunciation: async (formData: FormData) => {
    const response = await api.post('/stt/evaluate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  transcribeAudio: async (formData: FormData) => {
    const response = await api.post('/stt/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getMyEvaluations: async (page = 1, limit = 20, wordId?: string) => {
    const response = await api.get('/stt/my-evaluations', { params: { page, limit, wordId } });
    return response.data;
  },

  getMyStats: async () => {
    const response = await api.get('/stt/my-stats');
    return response.data;
  },
};

// Admin Statistics API
export const adminStatsAPI = {
  getDashboardStats: async (startDate?: string, endDate?: string) => {
    const response = await api.get('/admin/stats/dashboard', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getUserStats: async (startDate?: string, endDate?: string, groupBy = 'day') => {
    const response = await api.get('/admin/stats/users', {
      params: { startDate, endDate, groupBy },
    });
    return response.data;
  },

  getLearningStats: async (
    level?: number,
    category?: string,
    startDate?: string,
    endDate?: string
  ) => {
    const response = await api.get('/admin/stats/learning', {
      params: { level, category, startDate, endDate },
    });
    return response.data;
  },

  getPronunciationStats: async (startDate?: string, endDate?: string) => {
    const response = await api.get('/admin/stats/pronunciation', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getContentStats: async () => {
    const response = await api.get('/admin/stats/content');
    return response.data;
  },

  getTrendStats: async (days = 30) => {
    const response = await api.get('/admin/stats/trends', {
      params: { days },
    });
    return response.data;
  },

  getGeographyStats: async () => {
    const response = await api.get('/admin/stats/geography');
    return response.data;
  },

  exportStats: async (type = 'dashboard', format = 'json') => {
    const response = await api.get('/admin/stats/export', {
      params: { type, format },
      responseType: format === 'csv' ? 'blob' : 'json',
    });
    return response.data;
  },
};

export default api;
