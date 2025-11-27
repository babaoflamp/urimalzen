import mongoose, { Document, Schema } from 'mongoose';

export interface IWord extends Document {
  koreanWord: string;
  mongolianWord: string;
  imageUrl: string;
  description: string;
  pronunciation: string;
  category: string;
  order: number;
  examples: Array<{
    korean: string;
    mongolian: string;
  }>;
  synonyms: string[];
  videoUrl?: string;
  readingContent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const wordSchema = new Schema<IWord>(
  {
    koreanWord: {
      type: String,
      required: [true, 'Korean word is required'],
      unique: true,
      trim: true,
    },
    mongolianWord: {
      type: String,
      required: [true, 'Mongolian word is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    pronunciation: {
      type: String,
      required: [true, 'Pronunciation is required'],
    },
    category: {
      type: String,
      default: 'flower',
    },
    order: {
      type: Number,
      required: true,
      unique: true,
    },
    examples: [
      {
        korean: {
          type: String,
          required: true,
        },
        mongolian: {
          type: String,
          required: true,
        },
      },
    ],
    synonyms: [
      {
        type: String,
      },
    ],
    videoUrl: {
      type: String,
      default: '',
    },
    readingContent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
wordSchema.index({ order: 1 });
wordSchema.index({ category: 1 });

export default mongoose.model<IWord>('Word', wordSchema);
