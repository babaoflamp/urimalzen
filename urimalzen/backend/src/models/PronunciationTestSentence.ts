import mongoose, { Document, Schema } from 'mongoose';

export interface IPronunciationTestSentence extends Document {
  sentenceNumber: number;
  koreanText: string;
  mongolianText: string;
  syllLtrs?: string;
  syllPhns?: string;
  fst?: any;
  isActive?: boolean;
  sentence: string;          // Korean sentence
  sentenceMn?: string;       // Mongolian translation
  sentenceCn?: string;       // Chinese translation
  order: number;             // Display order

  // KIIP/CEFR level
  level?: {
    kiip?: 0 | 1 | 2 | 3 | 4 | 5;
    cefr?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  };

  // SpeechPro pronunciation model data
  speechPro: {
    syllLtrs: string;        // Syllable letters from GTP API
    syllPhns: string;        // Syllable phonemes from GTP API
    fst: string;             // FST model from Model API
    lastUpdated: Date;       // Model generation timestamp
    errorCode?: number;      // Track API errors (0 = success)
  };

  // Difficulty metrics
  difficultyScore?: number;  // 1-100 difficulty rating

  // Metadata
  category?: string;         // Thematic category (greetings, shopping, etc.)
  tags?: string[];           // Additional tags for filtering

  createdAt: Date;
  updatedAt: Date;
}

const pronunciationTestSentenceSchema = new Schema<IPronunciationTestSentence>(
  {
    sentenceNumber: { type: Number, required: true },
  koreanText: { type: String, required: true },
  mongolianText: { type: String, required: true },
  syllLtrs: { type: String, default: '' },
  syllPhns: { type: String, default: '' },
  fst: { type: Schema.Types.Mixed, default: null },
  isActive: { type: Boolean, default: true },
    sentence: {
      type: String,
      required: [true, 'Sentence is required'],
      trim: true,
    },
    sentenceMn: {
      type: String,
      trim: true,
      default: '',
    },
    sentenceCn: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      required: true,
      unique: true,
    },
    level: {
      kiip: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        required: false,
      },
      cefr: {
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        required: false,
      },
    },
    speechPro: {
      syllLtrs: {
        type: String,
        required: true,
      },
      syllPhns: {
        type: String,
        required: true,
      },
      fst: {
        type: String,
        required: true,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
      errorCode: {
        type: Number,
        default: 0,
      },
    },
    difficultyScore: {
      type: Number,
      min: 1,
      max: 100,
      default: 50,
    },
    category: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
pronunciationTestSentenceSchema.index({ order: 1 });
pronunciationTestSentenceSchema.index({ 'level.kiip': 1 });
pronunciationTestSentenceSchema.index({ category: 1 });
pronunciationTestSentenceSchema.index({ difficultyScore: 1 });

export default mongoose.model<IPronunciationTestSentence>(
  'PronunciationTestSentence',
  pronunciationTestSentenceSchema
);
