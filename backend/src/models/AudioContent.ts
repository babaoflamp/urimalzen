import mongoose, { Document, Schema } from 'mongoose';

export interface IAudioContent extends Document {
  wordId: mongoose.Types.ObjectId;
  audioType: 'word' | 'example' | 'phoneme_rule';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  duration: number;
  voice: string;
  speed: number;
  pitch: number;
  generatedBy: 'admin' | 'auto';
  createdAt: Date;
  updatedAt: Date;
}

const audioContentSchema = new Schema<IAudioContent>(
  {
    wordId: {
      type: Schema.Types.ObjectId,
      ref: 'Word',
      required: true,
      index: true,
    },
    audioType: {
      type: String,
      enum: ['word', 'example', 'phoneme_rule'],
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    voice: {
      type: String,
      default: 'ko-KR-Wavenet-A',
    },
    speed: {
      type: Number,
      default: 1.0,
    },
    pitch: {
      type: Number,
      default: 0.0,
    },
    generatedBy: {
      type: String,
      enum: ['admin', 'auto'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
audioContentSchema.index({ wordId: 1, audioType: 1 });
audioContentSchema.index({ createdAt: -1 });

const AudioContent = mongoose.model<IAudioContent>('AudioContent', audioContentSchema);

export default AudioContent;
