export interface User {
  id: string;
  username: string;
  email: string;
  level: {
    cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    kiip: 1 | 2 | 3 | 4 | 5;
  };
  totalScore: number;
  region: string;
  country: string;
}

export interface Word {
  _id: string;
  koreanWord: string;
  mongolianWord: string;
  imageUrl: string;
  description: string;
  pronunciation: string;
  category: string;
  order: number;
  examples: Array<{
    korean: string;
    mongolian: string;
  }>;
  synonyms: string[];
  videoUrl?: string;
  readingContent?: string;
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
