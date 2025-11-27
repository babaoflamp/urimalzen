import mongoose, { Document, Schema } from 'mongoose';

export interface IRecording extends Document {
  userId: mongoose.Types.ObjectId;
  wordId: mongoose.Types.ObjectId;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  duration: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

const recordingSchema = new Schema<IRecording>(
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
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    duration: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: 'audio/webm',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
recordingSchema.index({ userId: 1, wordId: 1 });
recordingSchema.index({ createdAt: -1 });

export default mongoose.model<IRecording>('Recording', recordingSchema);
