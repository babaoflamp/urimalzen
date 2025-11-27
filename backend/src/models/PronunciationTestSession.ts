import mongoose, { Document, Schema } from 'mongoose';

/**
 * PronunciationTestSession Model
 *
 * Represents a user's pronunciation test session.
 * Tracks multiple sentence evaluations in a single test session.
 * Based on korean-pro-demo's session management approach.
 */

export interface IPronunciationTestSession extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;                  // User-entered name at session start

  // Session metadata
  startTime: Date;
  endTime?: Date;
  status: 'in-progress' | 'completed' | 'abandoned';

  // Test configuration
  selectedSentenceIds: mongoose.Types.ObjectId[]; // Test sentences used
  totalSentences: number;
  completedSentences: number;

  // Overall scores
  averageScore: number;              // 0-1 (average of all evaluations)
  totalDuration: number;             // Total test time in seconds

  // Answer tracking
  answerIds: mongoose.Types.ObjectId[]; // References to PronunciationTestAnswer

  // Metadata
  deviceInfo?: {
    userAgent: string;
    platform: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const pronunciationTestSessionSchema = new Schema<IPronunciationTestSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
    selectedSentenceIds: {
      type: [Schema.Types.ObjectId],
      ref: 'PronunciationTestSentence',
      default: [],
    },
    totalSentences: {
      type: Number,
      default: 0,
    },
    completedSentences: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    answerIds: {
      type: [Schema.Types.ObjectId],
      ref: 'PronunciationTestAnswer',
      default: [],
    },
    deviceInfo: {
      userAgent: String,
      platform: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
pronunciationTestSessionSchema.index({ userId: 1, createdAt: -1 });
pronunciationTestSessionSchema.index({ status: 1 });
pronunciationTestSessionSchema.index({ startTime: -1 });

const PronunciationTestSession = mongoose.model<IPronunciationTestSession>(
  'PronunciationTestSession',
  pronunciationTestSessionSchema
);

export default PronunciationTestSession;
