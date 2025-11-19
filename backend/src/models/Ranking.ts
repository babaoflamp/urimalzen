import mongoose, { Document, Schema } from 'mongoose';

export interface IRanking extends Document {
  userId: mongoose.Types.ObjectId;
  globalRank: number;
  countryRank: number;
  koreaRank: number;
  regionRank: number;
  score: number;
  wordsCompleted: number;
  totalAttempts: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const rankingSchema = new Schema<IRanking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    globalRank: {
      type: Number,
      default: 0,
    },
    countryRank: {
      type: Number,
      default: 0,
    },
    koreaRank: {
      type: Number,
      default: 0,
    },
    regionRank: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    wordsCompleted: {
      type: Number,
      default: 0,
    },
    totalAttempts: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for ranking queries
rankingSchema.index({ globalRank: 1 });
rankingSchema.index({ countryRank: 1 });
rankingSchema.index({ koreaRank: 1 });
rankingSchema.index({ regionRank: 1 });
rankingSchema.index({ score: -1 });

export default mongoose.model<IRanking>('Ranking', rankingSchema);
