import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  userAnswer: string | number;
  isCorrect: boolean;
  timeSpent: number; // seconds
}

export interface ITOPIKTestSession extends Document {
  userId: mongoose.Types.ObjectId;
  testSection: 'listening' | 'reading' | 'writing';
  topikLevel: 1 | 2 | 3 | 4 | 5 | 6;

  // Questions in this session
  questions: mongoose.Types.ObjectId[]; // References to TOPIKQuestion

  // User answers
  answers: IAnswer[];

  // Scoring
  totalScore: number;
  maxScore: number;

  // Timing
  startedAt: Date;
  completedAt?: Date;

  // Status
  status: 'in-progress' | 'completed' | 'abandoned';

  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'TOPIKQuestion',
      required: true,
    },
    userAnswer: {
      type: Schema.Types.Mixed, // Can be string or number
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    timeSpent: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const topikTestSessionSchema = new Schema<ITOPIKTestSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    testSection: {
      type: String,
      enum: ['listening', 'reading', 'writing'],
      required: [true, 'Test section is required'],
    },
    topikLevel: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6],
      required: [true, 'TOPIK level is required'],
    },

    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TOPIKQuestion',
      },
    ],

    answers: [answerSchema],

    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
topikTestSessionSchema.index({ userId: 1, status: 1 });
topikTestSessionSchema.index({ userId: 1, testSection: 1 });
topikTestSessionSchema.index({ userId: 1, topikLevel: 1 });
topikTestSessionSchema.index({ createdAt: -1 });

export default mongoose.model<ITOPIKTestSession>('TOPIKTestSession', topikTestSessionSchema);
