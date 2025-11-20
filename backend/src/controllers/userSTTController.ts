import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as sttService from '../services/sttService';
import PronunciationEvaluation from '../models/PronunciationEvaluation';
import Recording from '../models/Recording';
import Word from '../models/Word';
import multer from 'multer';
import path from 'path';

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/recordings'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `recording-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  },
});

/**
 * Evaluate pronunciation from uploaded audio
 * POST /api/stt/evaluate
 */
export const evaluatePronunciation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordId } = req.body;
    const audioFile = req.file;

    if (!wordId || !audioFile) {
      res.status(400).json({ success: false, message: 'Word ID and audio file are required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    // Find word
    const word = await Word.findById(wordId);
    if (!word) {
      res.status(404).json({ success: false, message: 'Word not found' });
      return;
    }

    // Create recording record
    const recording = await Recording.create({
      userId: req.user.id,
      wordId,
      fileUrl: `/uploads/recordings/${audioFile.filename}`,
      fileName: audioFile.filename,
      fileSize: audioFile.size,
      duration: 0, // Will be updated if available
      mimeType: audioFile.mimetype,
    });

    // Evaluate pronunciation using STT service
    const evaluation = await sttService.evaluatePronunciation(
      audioFile.buffer || audioFile.path,
      word.koreanWord
    );

    // Save evaluation to database
    const savedEvaluation = await PronunciationEvaluation.create({
      userId: req.user.id,
      wordId,
      recordingId: recording._id,
      recognizedText: evaluation.recognizedText,
      expectedText: word.koreanWord,
      accuracyScore: evaluation.accuracyScore,
      feedback: evaluation.feedback,
      feedbackMn: evaluation.feedbackMn,
      detailedScores: evaluation.detailedScores,
    });

    res.status(200).json({
      success: true,
      data: {
        evaluation: savedEvaluation,
        recording,
      },
      message: 'Pronunciation evaluated successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error evaluating pronunciation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to evaluate pronunciation',
      error: error.message,
    });
    return;
  }
};

/**
 * Transcribe audio to text (without evaluation)
 * POST /api/stt/transcribe
 */
export const transcribeAudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const audioFile = req.file;

    if (!audioFile) {
      res.status(400).json({ success: false, message: 'Audio file is required' });
      return;
    }

    // Transcribe audio using STT service
    const transcription = await sttService.transcribeAudio(audioFile.buffer || audioFile.path);

    res.status(200).json({
      success: true,
      data: { text: transcription },
      message: 'Audio transcribed successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to transcribe audio',
      error: error.message,
    });
    return;
  }
};

/**
 * Get user's pronunciation evaluation history
 * GET /api/stt/my-evaluations?page=1&limit=20&wordId=xxx
 */
export const getMyEvaluations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const wordId = req.query.wordId as string;

    const filter: any = { userId: req.user.id };
    if (wordId) filter.wordId = wordId;

    const skip = (page - 1) * limit;

    const [evaluations, total] = await Promise.all([
      PronunciationEvaluation.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('wordId', 'koreanWord mongolianWord pronunciation')
        .populate('recordingId', 'fileUrl duration'),
      PronunciationEvaluation.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: evaluations,
      count: evaluations.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
    return;
  } catch (error: any) {
    console.error('Error fetching user evaluations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch evaluations',
      error: error.message,
    });
    return;
  }
};

/**
 * Get user's pronunciation statistics
 * GET /api/stt/my-stats
 */
export const getMyStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const filter = { userId: req.user.id };

    const [total, avgScores, recentEvaluations] = await Promise.all([
      PronunciationEvaluation.countDocuments(filter),
      PronunciationEvaluation.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            avgAccuracy: { $avg: '$accuracyScore' },
            avgPronunciation: { $avg: '$detailedScores.pronunciation' },
            avgFluency: { $avg: '$detailedScores.fluency' },
            avgCompleteness: { $avg: '$detailedScores.completeness' },
            maxAccuracy: { $max: '$accuracyScore' },
            minAccuracy: { $min: '$accuracyScore' },
          },
        },
      ]),
      PronunciationEvaluation.find(filter)
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('wordId', 'koreanWord'),
    ]);

    const stats = {
      total,
      averages: avgScores[0] || {
        avgAccuracy: 0,
        avgPronunciation: 0,
        avgFluency: 0,
        avgCompleteness: 0,
        maxAccuracy: 0,
        minAccuracy: 0,
      },
      recentEvaluations,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
    return;
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message,
    });
    return;
  }
};
