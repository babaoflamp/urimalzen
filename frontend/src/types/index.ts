export interface User {
  id: string;
  username: string;
  email: string;
  level: {
    cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    kiip: 0 | 1 | 2 | 3 | 4 | 5;
  };
  totalScore: number;
  region: string;
  country: string;
  isAdmin: boolean; // Admin role flag
}

export interface Word {
  _id: string;
  koreanWord: string;
  mongolianWord: string;
  imageUrl: string;
  description: string;
  pronunciation: string;
  category: string; // Legacy field
  order: number;
  examples: Array<{
    korean: string;
    mongolian: string;
  }>;
  synonyms: string[];
  videoUrl?: string;
  readingContent?: string;
  // New KIIP fields
  level: {
    kiip: 0 | 1 | 2 | 3 | 4 | 5;
    cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  };
  mainCategory: string;
  subCategory: string;
  phonemeRules: string[];
  standardPronunciation: string;
  antonyms: string[];
  collocations: string[];
  relatedWords: string[];
  difficultyScore: number;
  frequencyRank?: number;
  wordType: 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'other';
  formalityLevel: 'informal' | 'neutral' | 'formal';
  culturalNote?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProgress {
  _id: string;
  userId: string;
  wordId: Word | string;
  completed: boolean;
  score: number;
  attempts: number;
  lastAttemptAt: Date;
  recordings: string[];
}

export interface Recording {
  _id: string;
  userId: string;
  wordId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  duration: number;
  mimeType: string;
  createdAt: Date;
}

export interface Ranking {
  _id: string;
  userId: string;
  globalRank: number;
  countryRank: number;
  koreaRank: number;
  regionRank: number;
  score: number;
  wordsCompleted: number;
  totalAttempts: number;
  lastUpdated: Date;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  nameEn: string;
  nameMn: string;
  order: number;
  icon: string;
  description: string;
  descriptionMn: string;
  subCategories: string[];
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryStats {
  category: string;
  totalWords: number;
  wordsByLevel: Array<{
    _id: number;
    count: number;
  }>;
  wordsBySubCategory: Array<{
    _id: string;
    count: number;
  }>;
}

// Pronunciation types
export interface PhonemeRule {
  _id: string;
  ruleName: string;
  ruleNameEn: string;
  ruleNameMn: string;
  description: string;
  descriptionMn: string;
  pattern: string;
  examples: Array<{
    word: string;
    written: string;
    pronounced: string;
    writtenMn: string;
    pronouncedMn: string;
  }>;
  kiipLevel: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PronunciationAnalysis {
  word: string;
  rulesFound: number;
  rules: Array<{
    ruleId: string;
    ruleName: string;
    ruleNameMn: string;
    description: string;
    descriptionMn: string;
    examples: PhonemeRule['examples'];
  }>;
}

// Unit and Lesson types
export interface Exercise {
  exerciseType: 'vocabulary' | 'listening' | 'pronunciation' | 'reading' | 'writing';
  wordIds: string[];
  instructions: string;
  instructionsMn: string;
}

export interface Lesson {
  lessonNumber: number;
  title: string;
  titleMn: string;
  exercises: Exercise[];
  learningObjective: string;
  learningObjectiveMn: string;
}

export interface Challenge {
  challengeType: 'mixed' | 'speed' | 'accuracy';
  wordIds: string[];
  timeLimit?: number;
  passingScore: number;
  instructions: string;
  instructionsMn: string;
}

export interface Unit {
  _id: string;
  unitNumber: number;
  title: string;
  titleMn: string;
  kiipLevel: number;
  mainCategory: string;
  lessons: Lesson[];
  challenge: Challenge;
  order: number;
  description: string;
  descriptionMn: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

// AI/TTS/STT Configuration types
export interface AIConfiguration {
  _id: string;
  serviceName: 'ollama' | 'openai' | 'claude' | 'gemini';
  apiUrl: string;
  apiKey?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TTSConfiguration {
  _id: string;
  serviceName: 'google' | 'azure' | 'naver' | 'custom';
  apiUrl: string;
  apiKey?: string;
  voice: string;
  speed: number;
  pitch: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface STTConfiguration {
  _id: string;
  serviceName: 'google' | 'azure' | 'whisper' | 'custom';
  apiUrl: string;
  apiKey?: string;
  language: string;
  accuracyThreshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// AI Generated Content types
export interface AIGeneratedContent {
  wordId: string;
  aiDescription?: string;
  aiDescriptionMn?: string;
  aiExamples?: Array<{
    korean: string;
    mongolian: string;
  }>;
  pronunciationTips?: string;
  pronunciationTipsMn?: string;
  generatedAt: Date;
}

// TTS Audio Content types
export interface AudioContent {
  _id: string;
  wordId: string;
  audioType: 'word' | 'example' | 'phoneme_rule';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  duration: number;
  voice: string;
  speed: number;
  generatedBy: 'admin' | 'auto';
  createdAt: Date;
}

// STT Pronunciation Evaluation types
export interface PronunciationEvaluation {
  _id: string;
  userId: string;
  wordId: string;
  recordingId: string;
  recognizedText: string;
  expectedText: string;
  accuracyScore: number;
  feedback: string;
  feedbackMn: string;
  detailedScores?: {
    pronunciation: number;
    fluency: number;
    completeness: number;
  };
  createdAt: Date;
}

// AI API Request/Response types
export interface AIContentGenerationRequest {
  wordId: string;
  contentType: 'description' | 'examples' | 'tips' | 'all';
  language: 'ko' | 'mn' | 'both';
}

export interface AIContentGenerationResponse {
  success: boolean;
  data?: {
    description?: string;
    descriptionMn?: string;
    examples?: Array<{ korean: string; mongolian: string }>;
    tips?: string;
    tipsMn?: string;
  };
  message?: string;
  error?: string;
}

// TTS API Request/Response types
export interface TTSGenerationRequest {
  wordId?: string;
  text: string;
  voice?: string;
  speed?: number;
  pitch?: number;
  outputFormat?: 'mp3' | 'wav' | 'webm';
}

export interface TTSGenerationResponse {
  success: boolean;
  audioUrl?: string;
  duration?: number;
  fileSize?: number;
  message?: string;
  error?: string;
}

// STT API Request/Response types
export interface STTEvaluationRequest {
  audioFile: File | Blob;
  wordId: string;
  expectedText: string;
}

export interface STTEvaluationResponse {
  success: boolean;
  data?: {
    recognizedText: string;
    accuracyScore: number;
    feedback: string;
    feedbackMn: string;
    detailedScores?: {
      pronunciation: number;
      fluency: number;
      completeness: number;
    };
  };
  message?: string;
  error?: string;
}

// Admin Dashboard Stats
export interface AdminStats {
  totalUsers: number;
  totalWords: number;
  totalRecordings: number;
  activeUsers: number;
  aiGeneratedContent?: number;
  ttsAudioFiles?: number;
  sttEvaluations?: number;
}
