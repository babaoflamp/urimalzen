import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  wordId: mongoose.Types.ObjectId;
  completed: boolean;
  score: number;
  attempts: number;
  lastAttemptAt: Date;
  recordings: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    wordId: {
      type: Schema.Types.ObjectId,
      ref: 'Word',
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastAttemptAt: {
      type: Date,
      default: Date.now,
    },
    recordings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Recording',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for unique user-word combination
userProgressSchema.index({ userId: 1, wordId: 1 }, { unique: true });

// Index for faster queries
userProgressSchema.index({ userId: 1, completed: 1 });

export default mongoose.model<IUserProgress>('UserProgress', userProgressSchema);
