import { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import PronunciationTestSentence from '../models/PronunciationTestSentence';
import PronunciationTestSession from '../models/PronunciationTestSession';
import PronunciationTestAnswer from '../models/PronunciationTestAnswer';
import { callGTP, callModel, callScore, normalizeSpaces } from '../services/speechproService';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/pronunciation-test';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'pronunciation-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /wav|webm|mp3|ogg|m4a/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
});

/**
 * Get all pronunciation test sentences
 * @route GET /api/pronunciation/test/sentences
 * @query kiipLevel - Optional filter by KIIP level
 * @query difficultyLevel - Optional filter by difficulty
 * @access Public
 */
export const getAllTestSentences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: any = { isActive: true };

    if (req.query.kiipLevel) {
      query.kiipLevel = parseInt(req.query.kiipLevel as string);
    }

    if (req.query.difficultyLevel) {
      query.difficultyLevel = parseInt(req.query.difficultyLevel as string);
    }

    const sentences = await PronunciationTestSentence.find(query).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: sentences.length,
      data: sentences,
    });
    return;
  } catch (error: any) {
    console.error('Error getting test sentences:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get a specific test sentence by ID
 * @route GET /api/pronunciation/test/sentences/:id
 * @access Public
 */
export const getTestSentenceById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sentence = await PronunciationTestSentence.findById(req.params.id);

    if (!sentence) {
      res.status(404).json({
        success: false,
        message: 'Test sentence not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: sentence,
    });
    return;
  } catch (error: any) {
    console.error('Error getting test sentence:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Generate or retrieve cached SpeechPro model for a sentence
 * @route POST /api/pronunciation/test/sentences/:id/generate-model
 * @access Private/Admin
 */
export const generateSpeechProModel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sentence = await PronunciationTestSentence.findById(req.params.id);

    if (!sentence) {
      res.status(404).json({
        success: false,
        message: 'Test sentence not found',
      });
      return;
    }

    // Check if model already exists
    if (sentence.syllLtrs && sentence.syllPhns && sentence.fst) {
      res.status(200).json({
        success: true,
        message: 'Model already exists',
        data: {
          syllLtrs: sentence.syllLtrs,
          syllPhns: sentence.syllPhns,
          fst: sentence.fst,
        },
      });
      return;
    }

    // Generate GTP
    const gtpResponse = await callGTP({
      id: sentence._id.toString(),
      text: normalizeSpaces(sentence.koreanText),
    });

    // Generate Model
    const modelResponse = await callModel({
      id: sentence._id.toString(),
      text: normalizeSpaces(sentence.koreanText),
      'syll ltrs': gtpResponse['syll ltrs'],
      'syll phns': gtpResponse['syll phns'],
    });

    // Update sentence with model data
    sentence.syllLtrs = modelResponse['syll ltrs'];
    sentence.syllPhns = modelResponse['syll phns'];
    sentence.fst = modelResponse.fst;
    await sentence.save();

    res.status(200).json({
      success: true,
      message: 'Model generated successfully',
      data: {
        syllLtrs: sentence.syllLtrs,
        syllPhns: sentence.syllPhns,
        fst: sentence.fst,
      },
    });
    return;
  } catch (error: any) {
    console.error('Error generating SpeechPro model:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate model',
      error: error.message,
    });
    return;
  }
};

/**
 * Start a new pronunciation test session
 * @route POST /api/pronunciation/test/session/start
 * @body userName - User's name
 * @body sentenceIds - Array of sentence IDs to test (optional, defaults to random selection)
 * @access Private
 */
export const startTestSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userName, sentenceIds } = req.body;

    if (!userName || typeof userName !== 'string') {
      res.status(400).json({
        success: false,
        message: 'User name is required',
      });
      return;
    }

    let selectedSentenceIds = sentenceIds;

    // If no sentences specified, select random sentences
    if (!selectedSentenceIds || selectedSentenceIds.length === 0) {
      const allSentences = await PronunciationTestSentence.find({ isActive: true })
        .sort({ order: 1 })
        .limit(10);  // Default to 10 sentences
      selectedSentenceIds = allSentences.map((s) => s._id);
    }

    // Create new session
    const session = await PronunciationTestSession.create({
      userId: req.user._id,
      userName,
      startTime: new Date(),
      status: 'in-progress',
      selectedSentenceIds,
      totalSentences: selectedSentenceIds.length,
      completedSentences: 0,
      averageScore: 0,
      answerIds: [],
      deviceInfo: {
        userAgent: req.headers['user-agent'] || '',
        platform: req.headers['sec-ch-ua-platform'] || '',
      },
    });

    // Populate sentence details
    await session.populate('selectedSentenceIds');

    res.status(201).json({
      success: true,
      message: 'Test session started',
      data: session,
    });
    return;
  } catch (error: any) {
    console.error('Error starting test session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start test session',
      error: error.message,
    });
    return;
  }
};

/**
 * Evaluate pronunciation for a sentence
 * @route POST /api/pronunciation/test/evaluate
 * @body sessionId - Test session ID
 * @body sentenceId - Sentence ID being evaluated
 * @body audioFile - Audio file (via multer upload)
 * @body timeSpent - Time spent on this sentence (seconds)
 * @access Private
 */
export const evaluatePronunciation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId, sentenceId, timeSpent } = req.body;

    if (!sessionId || !sentenceId) {
      res.status(400).json({
        success: false,
        message: 'Session ID and Sentence ID are required',
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Audio file is required',
      });
      return;
    }

    // Verify session exists and belongs to user
    const session = await PronunciationTestSession.findOne({
      _id: sessionId,
      userId: req.user._id,
    });

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Test session not found',
      });
      return;
    }

    // Get sentence
    const sentence = await PronunciationTestSentence.findById(sentenceId);

    if (!sentence) {
      res.status(404).json({
        success: false,
        message: 'Test sentence not found',
      });
      return;
    }

    // Ensure model is generated
    if (!sentence.syllLtrs || !sentence.syllPhns || !sentence.fst) {
      res.status(400).json({
        success: false,
        message: 'SpeechPro model not generated for this sentence. Please contact administrator.',
      });
      return;
    }

    // Read audio file and convert to base64
    const audioPath = req.file.path;
    const audioBuffer = fs.readFileSync(audioPath);
    const audioBase64 = audioBuffer.toString('base64');

    // Call SpeechPro Score API
    const scoreResponse = await callScore({
      id: sentence._id.toString(),
      text: normalizeSpaces(sentence.koreanText),
      'syll ltrs': sentence.syllLtrs,
      'syll phns': sentence.syllPhns,
      fst: sentence.fst,
      'wav usr': audioBase64,
    });

    // Parse score response
    const evaluationResult = {
      sentenceScore: scoreResponse.score || 0,
      wordScores: scoreResponse.details?.words || [],
      recognizedText: scoreResponse.details?.recognizedText || '',
    };

    // Create answer document
    const answer = await PronunciationTestAnswer.create({
      sessionId,
      userId: req.user._id,
      sentenceId: sentence._id,
      sentenceNumber: sentence.sentenceNumber,
      koreanText: sentence.koreanText,
      mongolianText: sentence.mongolianText,
      audioUrl: `/uploads/pronunciation-test/${req.file.filename}`,
      audioFileName: req.file.filename,
      audioFileSize: req.file.size,
      audioDuration: 0,  // Can be calculated from audio if needed
      evaluationResult,
      rawScoreData: scoreResponse,
      evaluatedAt: new Date(),
      timeSpent: parseInt(timeSpent) || 0,
    });

    // Update session
    session.answerIds.push(answer._id);
    session.completedSentences += 1;

    // Recalculate average score
    const allAnswers = await PronunciationTestAnswer.find({ sessionId });
    const totalScore = allAnswers.reduce((sum, ans) => sum + ans.evaluationResult.sentenceScore, 0);
    session.averageScore = totalScore / allAnswers.length;

    // Check if session is complete
    if (session.completedSentences >= session.totalSentences) {
      session.status = 'completed';
      session.endTime = new Date();
      session.totalDuration = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000);
    }

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Pronunciation evaluated successfully',
      data: {
        answer,
        session: {
          completedSentences: session.completedSentences,
          totalSentences: session.totalSentences,
          averageScore: session.averageScore,
          status: session.status,
        },
      },
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
 * Get test session by ID
 * @route GET /api/pronunciation/test/session/:id
 * @access Private
 */
export const getTestSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const session = await PronunciationTestSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate('selectedSentenceIds')
      .populate('answerIds');

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Test session not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: session,
    });
    return;
  } catch (error: any) {
    console.error('Error getting test session:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get all answers for a test session
 * @route GET /api/pronunciation/test/session/:id/answers
 * @access Private
 */
export const getSessionAnswers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Verify session belongs to user
    const session = await PronunciationTestSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Test session not found',
      });
      return;
    }

    const answers = await PronunciationTestAnswer.find({ sessionId: req.params.id })
      .populate('sentenceId')
      .sort({ sentenceNumber: 1 });

    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers,
    });
    return;
  } catch (error: any) {
    console.error('Error getting session answers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get user's test history
 * @route GET /api/pronunciation/test/history
 * @query limit - Number of sessions to return (default: 10)
 * @access Private
 */
export const getTestHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const sessions = await PronunciationTestSession.find({ userId: req.user._id })
      .sort({ startTime: -1 })
      .limit(limit)
      .populate('selectedSentenceIds');

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
    return;
  } catch (error: any) {
    console.error('Error getting test history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Create a new test sentence (Admin only)
 * @route POST /api/pronunciation/test/sentences
 * @access Private/Admin
 */
export const createTestSentence = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      sentenceNumber,
      koreanText,
      mongolianText,
      chineseText,
      difficultyLevel,
      kiipLevel,
      category,
      grammarPoints,
      order,
    } = req.body;

    // Check if sentence number already exists
    const existing = await PronunciationTestSentence.findOne({ sentenceNumber });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'Sentence number already exists',
      });
      return;
    }

    const sentence = await PronunciationTestSentence.create({
      sentenceNumber,
      koreanText,
      mongolianText,
      chineseText,
      difficultyLevel: difficultyLevel || 3,
      kiipLevel: kiipLevel || 2,
      category: category || 'general',
      grammarPoints: grammarPoints || [],
      order: order || sentenceNumber,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Test sentence created successfully',
      data: sentence,
    });
    return;
  } catch (error: any) {
    console.error('Error creating test sentence:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test sentence',
      error: error.message,
    });
    return;
  }
};

/**
 * Update a test sentence (Admin only)
 * @route PUT /api/pronunciation/test/sentences/:id
 * @access Private/Admin
 */
export const updateTestSentence = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sentence = await PronunciationTestSentence.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sentence) {
      res.status(404).json({
        success: false,
        message: 'Test sentence not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Test sentence updated successfully',
      data: sentence,
    });
    return;
  } catch (error: any) {
    console.error('Error updating test sentence:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update test sentence',
      error: error.message,
    });
    return;
  }
};

/**
 * Delete a test sentence (Admin only)
 * @route DELETE /api/pronunciation/test/sentences/:id
 * @access Private/Admin
 */
export const deleteTestSentence = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sentence = await PronunciationTestSentence.findById(req.params.id);

    if (!sentence) {
      res.status(404).json({
        success: false,
        message: 'Test sentence not found',
      });
      return;
    }

    // Soft delete by setting isActive to false
    sentence.isActive = false;
    await sentence.save();

    res.status(200).json({
      success: true,
      message: 'Test sentence deleted successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error deleting test sentence:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete test sentence',
      error: error.message,
    });
    return;
  }
};
