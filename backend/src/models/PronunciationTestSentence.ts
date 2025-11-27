import mongoose, { Document, Schema } from 'mongoose';

/**
 * PronunciationTestSentence Model
 *
 * Represents a fixed Korean test sentence for pronunciation evaluation.
 * Based on korean-pro-demo's SpKoQuestion model.
 *
 * Contains 20 fixed Korean sentences covering various grammatical structures
 * and difficulty levels for comprehensive pronunciation testing.
 */

export interface IPronunciationTestSentence extends Document {
  sentenceNumber: number;  // 1-20
  koreanText: string;      // Korean sentence (original text)
  mongolianText: string;   // Mongolian translation
  chineseText?: string;    // Chinese translation (optional)

  // Difficulty and categorization
  difficultyLevel: number; // 1-5 (1=easiest, 5=hardest)
  kiipLevel: number;       // 0-5 (matching KIIP levels)
  category: string;        // e.g., 'greeting', 'conditional', 'complex'
  grammarPoints: string[]; // Grammar structures used in sentence

  // SpeechPro model data (generated once and cached)
  syllLtrs?: string;       // Syllable letters from GTP
  syllPhns?: string;       // Syllable phonemes from GTP
  fst?: string;            // FST model from Model endpoint

  // Metadata
  isActive: boolean;       // Whether sentence is currently in use
  order: number;           // Display order
  createdAt: Date;
  updatedAt: Date;
}

const pronunciationTestSentenceSchema = new Schema<IPronunciationTestSentence>(
  {
    sentenceNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 20,
    },
    koreanText: {
      type: String,
      required: true,
      trim: true,
    },
    mongolianText: {
      type: String,
      required: true,
      trim: true,
    },
    chineseText: {
      type: String,
      trim: true,
    },
    difficultyLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 3,
    },
    kiipLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 2,
    },
    category: {
      type: String,
      required: true,
      default: 'general',
    },
    grammarPoints: {
      type: [String],
      default: [],
    },
    // SpeechPro cached data
    syllLtrs: {
      type: String,
    },
    syllPhns: {
      type: String,
    },
    fst: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
pronunciationTestSentenceSchema.index({ sentenceNumber: 1 });
pronunciationTestSentenceSchema.index({ order: 1 });
pronunciationTestSentenceSchema.index({ kiipLevel: 1, difficultyLevel: 1 });
pronunciationTestSentenceSchema.index({ isActive: 1 });

const PronunciationTestSentence = mongoose.model<IPronunciationTestSentence>(
  'PronunciationTestSentence',
  pronunciationTestSentenceSchema
);

export default PronunciationTestSentence;
