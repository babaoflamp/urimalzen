import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  programType: 'kiip' | 'topik';  // NEW: 프로그램 타입
  level: {
    cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    kiip?: 0 | 1 | 2 | 3 | 4 | 5;    // KIIP 사용자만 (선택적)
    topik?: 1 | 2 | 3 | 4 | 5 | 6;   // NEW: TOPIK 사용자만 (선택적)
  };
  totalScore: number;
  region: string;
  country: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    programType: {
      type: String,
      enum: ['kiip', 'topik'],
      required: [true, 'Program type is required'],
      default: 'kiip',  // 기존 사용자 호환성을 위해 기본값 kiip
    },
    level: {
      cefr: {
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        default: 'A1',
      },
      kiip: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        required: false,  // 선택적 필드로 변경
      },
      topik: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6],
        required: false,  // 선택적 필드
      },
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    region: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

export default mongoose.model<IUser>('User', userSchema);
