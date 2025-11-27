import mongoose, { Document, Schema } from 'mongoose';

export interface IAIConfiguration extends Document {
  serviceName: 'ollama' | 'openai' | 'claude' | 'gemini';
  apiUrl: string;
  apiKey?: string;
  modelName: string;
  temperature?: number;
  maxTokens?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITTSConfiguration extends Document {
  serviceName: 'google' | 'azure' | 'naver' | 'custom';
  apiUrl: string;
  apiKey?: string;
  voice: string;
  speed: number;
  pitch: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISTTConfiguration extends Document {
  serviceName: 'google' | 'azure' | 'whisper' | 'custom';
  apiUrl: string;
  apiKey?: string;
  language: string;
  accuracyThreshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// AI Configuration Schema
const aiConfigurationSchema = new Schema<IAIConfiguration>(
  {
    serviceName: {
      type: String,
      enum: ['ollama', 'openai', 'claude', 'gemini'],
      required: true,
      unique: true,
    },
    apiUrl: {
      type: String,
      required: true,
    },
    apiKey: {
      type: String,
      select: false, // Don't include in default queries for security
    },
    modelName: {
      type: String,
      required: true,
    },
    temperature: {
      type: Number,
      min: 0,
      max: 2,
      default: 0.7,
    },
    maxTokens: {
      type: Number,
      default: 2000,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// TTS Configuration Schema
const ttsConfigurationSchema = new Schema<ITTSConfiguration>(
  {
    serviceName: {
      type: String,
      enum: ['google', 'azure', 'naver', 'custom'],
      required: true,
      unique: true,
    },
    apiUrl: {
      type: String,
      required: true,
    },
    apiKey: {
      type: String,
      select: false,
    },
    voice: {
      type: String,
      required: true,
    },
    speed: {
      type: Number,
      min: 0.25,
      max: 4.0,
      default: 1.0,
    },
    pitch: {
      type: Number,
      min: -20,
      max: 20,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// STT Configuration Schema
const sttConfigurationSchema = new Schema<ISTTConfiguration>(
  {
    serviceName: {
      type: String,
      enum: ['google', 'azure', 'whisper', 'custom'],
      required: true,
      unique: true,
    },
    apiUrl: {
      type: String,
      required: true,
    },
    apiKey: {
      type: String,
      select: false,
    },
    language: {
      type: String,
      default: 'ko-KR',
    },
    accuracyThreshold: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.7,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Models
export const AIConfiguration = mongoose.model<IAIConfiguration>(
  'AIConfiguration',
  aiConfigurationSchema
);

export const TTSConfiguration = mongoose.model<ITTSConfiguration>(
  'TTSConfiguration',
  ttsConfigurationSchema
);

export const STTConfiguration = mongoose.model<ISTTConfiguration>(
  'STTConfiguration',
  sttConfigurationSchema
);
