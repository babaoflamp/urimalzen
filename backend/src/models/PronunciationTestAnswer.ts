import mongoose, { Document, Schema } from 'mongoose';

/**
 * PronunciationTestAnswer Model
 *
 * Stores individual pronunciation evaluation results for a sentence.
 * Contains detailed scoring at sentence, word, syllable, and phoneme levels.
 * Based on korean-pro-demo's SpKoAnswer model and SpeechPro API response structure.
 */

export interface IWordScore {
  word: string;
  score: number;              // 0-1
  syllableScores?: number[];  // Per-syllable scores
  phonemeScores?: number[];   // Per-phoneme scores
}

export interface ISentenceScore {
  sentenceScore: number;      // 0-1 (overall sentence score)
  wordScores: IWordScore[];   // Detailed word-level scores
  recognizedText?: string;    // What SpeechPro recognized
}

export interface IPronunciationTestAnswer extends Document {
  sessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  sentenceId: mongoose.Types.ObjectId;

  // Test metadata
  sentenceNumber: number;     // 1-20
  koreanText: string;         // Original sentence
  mongolianText: string;      // Mongolian translation

  // Audio data
  audioUrl: string;           // Path to recorded audio file
  audioFileName: string;      // Original filename
  audioFileSize: number;      // File size in bytes
  audioDuration: number;      // Duration in seconds

  // Evaluation results (from SpeechPro /scorejson)
  evaluationResult: ISentenceScore;
  rawScoreData?: any;         // Raw JSON response from SpeechPro

  // Timing
  evaluatedAt: Date;
  timeSpent: number;          // Time spent on this sentence (seconds)

  // Metadata
  errorOccurred?: boolean;
  errorMessage?: string;

  createdAt: Date;
}

const wordScoreSchema = new Schema(
  {
    word: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    syllableScores: {
      type: [Number],
      default: [],
    },
    phonemeScores: {
      type: [Number],
      default: [],
    },
  },
  { _id: false }
);

const sentenceScoreSchema = new Schema(
  {
    sentenceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    wordScores: {
      type: [wordScoreSchema],
      default: [],
    },
    recognizedText: {
      type: String,
    },
  },
  { _id: false }
);

const pronunciationTestAnswerSchema = new Schema<IPronunciationTestAnswer>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'PronunciationTestSession',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sentenceId: {
      type: Schema.Types.ObjectId,
      ref: 'PronunciationTestSentence',
      required: true,
      index: true,
    },
    sentenceNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    koreanText: {
      type: String,
      required: true,
    },
    mongolianText: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    audioFileName: {
      type: String,
      required: true,
    },
    audioFileSize: {
      type: Number,
      required: true,
    },
    audioDuration: {
      type: Number,
      default: 0,
    },
    evaluationResult: {
      type: sentenceScoreSchema,
      required: true,
    },
    rawScoreData: {
      type: Schema.Types.Mixed,
    },
    evaluatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    errorOccurred: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
pronunciationTestAnswerSchema.index({ sessionId: 1, sentenceNumber: 1 });
pronunciationTestAnswerSchema.index({ userId: 1, evaluatedAt: -1 });
pronunciationTestAnswerSchema.index({ sentenceId: 1 });
pronunciationTestAnswerSchema.index({ 'evaluationResult.sentenceScore': -1 });

const PronunciationTestAnswer = mongoose.model<IPronunciationTestAnswer>(
  'PronunciationTestAnswer',
  pronunciationTestAnswerSchema
);

export default PronunciationTestAnswer;
