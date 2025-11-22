import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/authRoutes';
import wordRoutes from './routes/wordRoutes';
import recordingRoutes from './routes/recordingRoutes';
import progressRoutes from './routes/progressRoutes';
import rankingRoutes from './routes/rankingRoutes';
import adminRoutes from './routes/adminRoutes';
import categoryRoutes from './routes/categoryRoutes';
import pronunciationRoutes from './routes/pronunciationRoutes';
import unitRoutes from './routes/unitRoutes';
import adminAIRoutes from './routes/adminAI';
import adminTTSRoutes from './routes/adminTTS';
import adminSTTRoutes from './routes/adminSTT';
import adminStatsRoutes from './routes/adminStatsRoutes';
import userTTSRoutes from './routes/userTTS';
import userSTTRoutes from './routes/userSTT';
import comfyuiRoutes from './routes/comfyuiRoutes';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for external access
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Urimalzen API' });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/pronunciation', pronunciationRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/recordings', recordingRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/admin', adminRoutes);

// Admin AI/TTS/STT routes
app.use('/api/admin/ai', adminAIRoutes);
app.use('/api/admin/tts', adminTTSRoutes);
app.use('/api/admin/stt', adminSTTRoutes);
app.use('/api/admin/stats', adminStatsRoutes);

// ComfyUI routes
app.use('/api/comfyui', comfyuiRoutes);

// User TTS/STT routes
app.use('/api/tts', userTTSRoutes);
app.use('/api/stt', userSTTRoutes);

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`External access enabled`);
  });
};

startServer();

export default app;
