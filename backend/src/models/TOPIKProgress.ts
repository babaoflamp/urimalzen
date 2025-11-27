import mongoose, { Document, Schema } from 'mongoose';

export interface ITOPIKProgress extends Document {
  userId: mongoose.Types.ObjectId;
  topikLevel: 1 | 2 | 3 | 4 | 5 | 6;

  // Section scores (average percentages)
  listeningScore: number;
  readingScore: number;
  writingScore: number;

  // Test statistics
  totalTests: number;
  completedTests: number;
  averageScore: number;

  // Last test date
  lastTestDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const topikProgressSchema = new Schema<ITOPIKProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    topikLevel: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6],
      required: [true, 'TOPIK level is required'],
    },

    listeningScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    readingScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    writingScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    totalTests: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedTests: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    lastTestDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user + level
topikProgressSchema.index({ userId: 1, topikLevel: 1 }, { unique: true });

// Method to update progress from a completed session
topikProgressSchema.methods.updateFromSession = async function (
  session: any
): Promise<void> {
  const scorePercentage = (session.totalScore / session.maxScore) * 100;

  // Update section score (running average)
  const sectionField = `${session.testSection}Score`;
  const currentScore = this[sectionField];
  const currentCount = this.completedTests;

  if (currentCount === 0) {
    this[sectionField] = scorePercentage;
  } else {
    // Calculate new average
    this[sectionField] =
      (currentScore * currentCount + scorePercentage) / (currentCount + 1);
  }

  // Update test counts
  this.totalTests += 1;
  this.completedTests += 1;

  // Update overall average score
  this.averageScore =
    (this.listeningScore + this.readingScore + this.writingScore) / 3;

  // Update last test date
  this.lastTestDate = session.completedAt || new Date();

  await this.save();
};

export default mongoose.model<ITOPIKProgress>('TOPIKProgress', topikProgressSchema);
