import mongoose, { Document, Schema } from 'mongoose';

export interface IWord extends Document {
  koreanWord: string;
  mongolianWord: string;
    imageUrl: string;
    chineseWord: string;
  description: string;
  pronunciation: string;
  category: string;
  order: number;
  examples: Array<{
    korean: string;
    mongolian: string;
    chinese?: string;
  }>;
  synonyms: string[];
  videoUrl?: string;
  readingContent?: string;

  // Program type for KIIP/TOPIK separation
  programType: 'kiip' | 'topik' | 'common';

  // New fields for KIIP integration
  level: {
    kiip?: 0 | 1 | 2 | 3 | 4 | 5;    // KIIP 사용자만 (선택적)
    cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    topik?: 1 | 2 | 3 | 4 | 5 | 6;   // TOPIK 사용자만 (선택적)
  };

  // 14 major category system
  mainCategory: string;
  subCategory: string;

  // Pronunciation analysis
  phonemeRules: string[];
  standardPronunciation: string;

  // Vocabulary relationships
  antonyms: string[];
  collocations: string[];
  relatedWords: string[];

  // Difficulty metrics
  difficultyScore: number;
  frequencyRank?: number;

  // Learning metadata
  wordType: 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'other';
  formalityLevel: 'informal' | 'neutral' | 'formal';
  culturalNote?: string;

  // TOPIK-specific fields
  testSection?: 'listening' | 'reading' | 'writing';
  grammarPattern?: string;
  questionType?: string;

  // SpeechPro pronunciation model data
  speechPro?: {
    syllLtrs: string;      // Syllable letters from GTP API
    syllPhns: string;      // Syllable phonemes from GTP API
    fst: string;           // FST model from Model API
    lastUpdated: Date;     // Model generation timestamp
    errorCode?: number;    // Track API errors (0 = success)
  };

  // VocaPro linguistic analysis data
  vocaPro?: {
    morphemes: Array<{
      surface: string;     // Original form
      lemma: string;       // Base form
      pos: string;         // Part of speech
    }>;
    definitions: Array<{
      definition: string;  // Korean definition
      definitionMn?: string; // Mongolian translation
    }>;
    cefrAnalysis?: {
      level: string;       // Detailed CEFR level
      score: number;       // Difficulty score 0-100
    };
    synonymsExtended: string[];  // From VocaPro analysis
    antonymsExtended: string[];  // From VocaPro analysis
    lastUpdated: Date;           // Analysis timestamp
    errorCode?: number;          // Track API errors (0 = success)
  };

  createdAt: Date;
  updatedAt: Date;
}

const wordSchema = new Schema<IWord>(
  {
    koreanWord: {
      type: String,
      required: [true, 'Korean word is required'],
      unique: true,
      trim: true,
    },
    mongolianWord: {
      type: String,
      required: [true, 'Mongolian word is required'],
      trim: true,
    },
      chineseWord: {
        type: String,
        required: false,
        trim: true,
        default: '',
      },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    pronunciation: {
      type: String,
      required: [true, 'Pronunciation is required'],
    },
    category: {
      type: String,
      default: 'flower',
    },
    order: {
      type: Number,
      required: true,
      unique: true,
    },
    examples: [
      {
        korean: {
          type: String,
          required: true,
        },
        mongolian: {
          type: String,
          required: true,
        },
        chinese: {
          type: String,
          required: false,
          default: '',
        },
      },
    ],
    synonyms: [
      {
        type: String,
      },
    ],
    videoUrl: {
      type: String,
      default: '',
    },
    readingContent: {
      type: String,
      default: '',
    },

    // Program type for KIIP/TOPIK separation
    programType: {
      type: String,
      enum: ['kiip', 'topik', 'common'],
      required: [true, 'Program type is required'],
      default: 'kiip',  // 기존 단어 호환성을 위해 기본값 kiip
    },

    // New fields for KIIP integration
    level: {
      kiip: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        required: false,  // 선택적 필드로 변경
      },
      cefr: {
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        default: 'A1',
      },
      topik: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6],
        required: false,  // 선택적 필드
      },
    },

    // 14 major category system
    mainCategory: {
      type: String,
      default: '자연과 환경',
    },
    subCategory: {
      type: String,
      default: '꽃',
    },

    // Pronunciation analysis
    phonemeRules: [
      {
        type: String,
      },
    ],
    standardPronunciation: {
      type: String,
      default: '',
    },

    // Vocabulary relationships
    antonyms: [
      {
        type: String,
      },
    ],
    collocations: [
      {
        type: String,
      },
    ],
    relatedWords: [
      {
        type: String,
      },
    ],

    // Difficulty metrics
    difficultyScore: {
      type: Number,
      min: 1,
      max: 100,
      default: 20,
    },
    frequencyRank: {
      type: Number,
      default: 0,
    },

    // Learning metadata
    wordType: {
      type: String,
      enum: ['noun', 'verb', 'adjective', 'adverb', 'particle', 'other'],
      default: 'noun',
    },
    formalityLevel: {
      type: String,
      enum: ['informal', 'neutral', 'formal'],
      default: 'neutral',
    },
    culturalNote: {
      type: String,
      default: '',
    },

    // TOPIK-specific fields
    testSection: {
      type: String,
      enum: ['listening', 'reading', 'writing'],
      required: false,
    },
    grammarPattern: {
      type: String,
      required: false,
    },
    questionType: {
      type: String,
      required: false,
    },

    // SpeechPro pronunciation model data
    speechPro: {
      syllLtrs: {
        type: String,
        default: '',
      },
      syllPhns: {
        type: String,
        default: '',
      },
      fst: {
        type: String,
        default: '',
      },
      lastUpdated: {
        type: Date,
        default: null,
      },
      errorCode: {
        type: Number,
        default: null,
      },
    },

    // VocaPro linguistic analysis data
    vocaPro: {
      morphemes: [
        {
          surface: {
            type: String,
            required: false,
          },
          lemma: {
            type: String,
            required: false,
          },
          pos: {
            type: String,
            required: false,
          },
        },
      ],
      definitions: [
        {
          definition: {
            type: String,
            required: false,
          },
          definitionMn: {
            type: String,
            required: false,
          },
        },
      ],
      cefrAnalysis: {
        level: {
          type: String,
          default: '',
        },
        score: {
          type: Number,
          default: 0,
        },
      },
      synonymsExtended: [
        {
          type: String,
        },
      ],
      antonymsExtended: [
        {
          type: String,
        },
      ],
      lastUpdated: {
        type: Date,
        default: null,
      },
      errorCode: {
        type: Number,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
// `order` field is declared `unique: true` which creates a unique index,
// so we avoid creating a duplicate index here.
wordSchema.index({ category: 1 });

// New indexes for KIIP integration
wordSchema.index({ 'level.kiip': 1, mainCategory: 1 });
wordSchema.index({ 'level.cefr': 1, difficultyScore: 1 });
wordSchema.index({ mainCategory: 1, subCategory: 1 });

// Index for TOPIK/KIIP separation
wordSchema.index({ programType: 1 });
wordSchema.index({ programType: 1, 'level.topik': 1 });
wordSchema.index({ programType: 1, testSection: 1 });

export default mongoose.model<IWord>('Word', wordSchema);
