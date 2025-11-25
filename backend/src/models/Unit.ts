import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson {
  lessonNumber: number;
  title: string;
  titleMn: string;
  wordIds: mongoose.Types.ObjectId[];
  isReview: boolean;
}

export interface IChallenge {
  wordIds: mongoose.Types.ObjectId[];
  passingScore: number;
}

export interface IUnit extends Document {
  unitNumber: number;
  title: string;
  titleMn: string;
  programType: 'kiip' | 'topik';  // NEW: 프로그램 타입
  kiipLevel?: number;              // KIIP 유닛만 (선택적)
  topikLevel?: number;             // NEW: TOPIK 유닛만 (선택적)
  testSection?: 'listening' | 'reading' | 'writing';  // NEW: TOPIK 시험 영역
  mainCategory: string;
  lessons: ILesson[];
  challenge: IChallenge;
  order: number;
  description: string;
  descriptionMn: string;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    lessonNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    titleMn: {
      type: String,
      required: true,
    },
    wordIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Word',
      },
    ],
    isReview: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const challengeSchema = new Schema<IChallenge>(
  {
    wordIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Word',
      },
    ],
    passingScore: {
      type: Number,
      default: 80,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

const unitSchema = new Schema<IUnit>(
  {
    unitNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Unit title is required'],
      trim: true,
    },
    titleMn: {
      type: String,
      required: [true, 'Mongolian title is required'],
      trim: true,
    },
    programType: {
      type: String,
      enum: ['kiip', 'topik'],
      required: [true, 'Program type is required'],
      default: 'kiip',  // 기존 유닛 호환성을 위해 기본값 kiip
    },
    kiipLevel: {
      type: Number,
      required: false,  // 선택적 필드로 변경
      enum: [0, 1, 2, 3, 4, 5],
    },
    topikLevel: {
      type: Number,
      required: false,  // 선택적 필드
      enum: [1, 2, 3, 4, 5, 6],
    },
    testSection: {
      type: String,
      enum: ['listening', 'reading', 'writing'],
      required: false,  // TOPIK 유닛만 사용
    },
    mainCategory: {
      type: String,
      required: true,
    },
    lessons: [lessonSchema],
    challenge: {
      type: challengeSchema,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    descriptionMn: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
// Note: order and unitNumber fields already have indexes due to unique: true
unitSchema.index({ kiipLevel: 1, order: 1 });
unitSchema.index({ mainCategory: 1 });

// Index for TOPIK/KIIP separation
unitSchema.index({ programType: 1 });
unitSchema.index({ programType: 1, topikLevel: 1 });
unitSchema.index({ programType: 1, testSection: 1 });

export default mongoose.model<IUnit>('Unit', unitSchema);
