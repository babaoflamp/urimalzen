import mongoose, { Document, Schema } from 'mongoose';

export interface IWord extends Document {
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

  // New fields for KIIP integration
  level: {
    kiip: 0 | 1 | 2 | 3 | 4 | 5;
    cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
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

    // New fields for KIIP integration
    level: {
      kiip: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        default: 1,
      },
      cefr: {
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        default: 'A1',
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
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
// Note: order field already has index due to unique: true
wordSchema.index({ category: 1 });

// New indexes for KIIP integration
wordSchema.index({ 'level.kiip': 1, mainCategory: 1 });
wordSchema.index({ 'level.cefr': 1, difficultyScore: 1 });
wordSchema.index({ mainCategory: 1, subCategory: 1 });

export default mongoose.model<IWord>('Word', wordSchema);
