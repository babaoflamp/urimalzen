import mongoose, { Document, Schema } from 'mongoose';

export interface IPhonemeRule extends Document {
  ruleName: string;
  ruleNameEn: string;
  ruleNameMn: string;
  description: string;
  descriptionMn: string;
  pattern: string;
  examples: Array<{
    word: string;
    written: string;
    pronounced: string;
    writtenMn: string;
    pronouncedMn: string;
  }>;
  kiipLevel: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const phonemeRuleSchema = new Schema<IPhonemeRule>(
  {
    ruleName: {
      type: String,
      required: [true, 'Rule name is required'],
      unique: true,
      trim: true,
    },
    ruleNameEn: {
      type: String,
      required: [true, 'English rule name is required'],
      trim: true,
    },
    ruleNameMn: {
      type: String,
      required: [true, 'Mongolian rule name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    descriptionMn: {
      type: String,
      required: [true, 'Mongolian description is required'],
    },
    pattern: {
      type: String,
      required: true,
      default: '',
    },
    examples: [
      {
        word: {
          type: String,
          required: true,
        },
        written: {
          type: String,
          required: true,
        },
        pronounced: {
          type: String,
          required: true,
        },
        writtenMn: {
          type: String,
          default: '',
        },
        pronouncedMn: {
          type: String,
          default: '',
        },
      },
    ],
    kiipLevel: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3, 4, 5],
      default: 1,
    },
    order: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
phonemeRuleSchema.index({ kiipLevel: 1, order: 1 });
phonemeRuleSchema.index({ ruleName: 1 });

export default mongoose.model<IPhonemeRule>('PhonemeRule', phonemeRuleSchema);
