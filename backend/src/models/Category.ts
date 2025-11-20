import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  nameEn: string;
  nameMn: string;
  order: number;
  icon: string;
  description: string;
  descriptionMn: string;
  subCategories: string[];
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    nameEn: {
      type: String,
      required: [true, 'English name is required'],
      trim: true,
    },
    nameMn: {
      type: String,
      required: [true, 'Mongolian name is required'],
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 14,
    },
    icon: {
      type: String,
      required: true,
      default: '📚',
    },
    description: {
      type: String,
      required: true,
    },
    descriptionMn: {
      type: String,
      required: true,
    },
    subCategories: [
      {
        type: String,
      },
    ],
    color: {
      type: String,
      default: '#667eea',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
categorySchema.index({ order: 1 });
categorySchema.index({ name: 1 });

export default mongoose.model<ICategory>('Category', categorySchema);
