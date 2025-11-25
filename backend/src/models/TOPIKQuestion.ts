import mongoose, { Document, Schema } from 'mongoose';

export interface IOption {
  text: string;
  textMn: string;
}

export interface ITOPIKQuestion extends Document {
  questionNumber: number;
  questionType: 'multiple-choice' | 'fill-in-blank' | 'essay' | 'short-answer' | 'listening-comprehension';
  testSection: 'listening' | 'reading' | 'writing';
  topikLevel: 1 | 2 | 3 | 4 | 5 | 6;

  // Question content
  questionText: string;
  questionTextMn: string;
  options: IOption[];  // For multiple-choice questions
  correctAnswer?: string | number;  // Answer key (option index or text)

  // Explanations
  explanation: string;
  explanationMn: string;

  // Media attachments
  audioUrl?: string;  // For listening questions
  imageUrl?: string;  // For visual context

  // Difficulty and scoring
  points: number;
  difficultyScore: number;  // 1-100

  // Metadata and relationships
  tags: string[];  // Grammar patterns, vocabulary themes
  relatedWordIds: mongoose.Types.ObjectId[];  // Related vocabulary
  grammarPattern?: string;  // Main grammar pattern tested

  // Usage tracking
  attemptCount: number;
  correctCount: number;
  averageScore: number;

  createdAt: Date;
  updatedAt: Date;
}

const optionSchema = new Schema<IOption>(
  {
    text: {
      type: String,
      required: true,
    },
    textMn: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const topikQuestionSchema = new Schema<ITOPIKQuestion>(
  {
    questionNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'fill-in-blank', 'essay', 'short-answer', 'listening-comprehension'],
      required: [true, 'Question type is required'],
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

    // Question content
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
    },
    questionTextMn: {
      type: String,
      required: [true, 'Mongolian question text is required'],
    },
    options: [optionSchema],
    correctAnswer: {
      type: Schema.Types.Mixed,  // Can be string or number
      required: false,
    },

    // Explanations
    explanation: {
      type: String,
      default: '',
    },
    explanationMn: {
      type: String,
      default: '',
    },

    // Media attachments
    audioUrl: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },

    // Difficulty and scoring
    points: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 10,
    },
    difficultyScore: {
      type: Number,
      required: true,
      default: 50,
      min: 1,
      max: 100,
    },

    // Metadata and relationships
    tags: [
      {
        type: String,
      },
    ],
    relatedWordIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Word',
      },
    ],
    grammarPattern: {
      type: String,
      default: '',
    },

    // Usage tracking
    attemptCount: {
      type: Number,
      default: 0,
    },
    correctCount: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
// Note: questionNumber already has index due to unique: true
topikQuestionSchema.index({ testSection: 1, topikLevel: 1 });
topikQuestionSchema.index({ questionType: 1, topikLevel: 1 });
topikQuestionSchema.index({ difficultyScore: 1 });
topikQuestionSchema.index({ tags: 1 });
topikQuestionSchema.index({ grammarPattern: 1 });

export default mongoose.model<ITOPIKQuestion>('TOPIKQuestion', topikQuestionSchema);
