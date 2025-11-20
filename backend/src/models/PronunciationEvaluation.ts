import mongoose, { Document, Schema } from 'mongoose';

export interface IPronunciationEvaluation extends Document {
  userId: mongoose.Types.ObjectId;
  wordId: mongoose.Types.ObjectId;
  recordingId: mongoose.Types.ObjectId;
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

const pronunciationEvaluationSchema = new Schema<IPronunciationEvaluation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    wordId: {
      type: Schema.Types.ObjectId,
      ref: 'Word',
      required: true,
      index: true,
    },
    recordingId: {
      type: Schema.Types.ObjectId,
      ref: 'Recording',
      required: true,
    },
    recognizedText: {
      type: String,
      required: true,
    },
    expectedText: {
      type: String,
      required: true,
    },
    accuracyScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    feedback: {
      type: String,
      required: true,
    },
    feedbackMn: {
      type: String,
      required: true,
    },
    detailedScores: {
      pronunciation: {
        type: Number,
        min: 0,
        max: 1,
      },
      fluency: {
        type: Number,
        min: 0,
        max: 1,
      },
      completeness: {
        type: Number,
        min: 0,
        max: 1,
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
pronunciationEvaluationSchema.index({ userId: 1, wordId: 1 });
pronunciationEvaluationSchema.index({ userId: 1, createdAt: -1 });
pronunciation EvaluationSchema.index({ accuracyScore: -1 });

const PronunciationEvaluation = mongoose.model<IPronunciationEvaluation>(
  'PronunciationEvaluation',
  pronunciationEvaluationSchema
);

export default PronunciationEvaluation;
