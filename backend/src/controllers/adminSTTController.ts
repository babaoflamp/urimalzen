import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as sttService from '../services/sttService';
import PronunciationEvaluation from '../models/PronunciationEvaluation';
import Recording from '../models/Recording';
import Word from '../models/Word';

/**
 * Get all pronunciation evaluations (paginated)
 * GET /api/admin/stt/evaluations?page=1&limit=20&userId=xxx&wordId=xxx
 */
export const getAllEvaluations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const userId = req.query.userId as string;
    const wordId = req.query.wordId as string;

    const filter: any = {};
    if (userId) filter.userId = userId;
    if (wordId) filter.wordId = wordId;

    const skip = (page - 1) * limit;

    const [evaluations, total] = await Promise.all([
      PronunciationEvaluation.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'username email')
        .populate('wordId', 'koreanWord mongolianWord')
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
    console.error('Error fetching evaluations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch evaluations',
      error: error.message,
    });
    return;
  }
};

/**
 * Get evaluation by ID
 * GET /api/admin/stt/evaluations/:id
 */
export const getEvaluationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const evaluation = await PronunciationEvaluation.findById(id)
      .populate('userId', 'username email')
      .populate('wordId', 'koreanWord mongolianWord pronunciation')
      .populate('recordingId', 'fileUrl duration');

    if (!evaluation) {
      res.status(404).json({ success: false, message: 'Evaluation not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: evaluation,
    });
    return;
  } catch (error: any) {
    console.error('Error fetching evaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch evaluation',
      error: error.message,
    });
    return;
  }
};

/**
 * Manually re-evaluate a recording
 * POST /api/admin/stt/re-evaluate
 */
export const reEvaluateRecording = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { recordingId } = req.body;

    if (!recordingId) {
      res.status(400).json({ success: false, message: 'Recording ID is required' });
      return;
    }

    // Find recording
    const recording = await Recording.findById(recordingId);
    if (!recording) {
      res.status(404).json({ success: false, message: 'Recording not found' });
      return;
    }

    // Find word
    const word = await Word.findById(recording.wordId);
    if (!word) {
      res.status(404).json({ success: false, message: 'Word not found' });
      return;
    }

    // Re-evaluate (this would need actual audio file from recording.fileUrl)
    // For now, we'll return a placeholder response
    res.status(200).json({
      success: true,
      message: 'Re-evaluation functionality requires audio file access',
      note: 'This endpoint needs to fetch the audio file from storage and send it to STT service',
    });
    return;
  } catch (error: any) {
    console.error('Error re-evaluating recording:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to re-evaluate recording',
      error: error.message,
    });
    return;
  }
};

/**
 * Get evaluation statistics
 * GET /api/admin/stt/stats
 */
export const getEvaluationStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, wordId } = req.query;

    const filter: any = {};
    if (userId) filter.userId = userId;
    if (wordId) filter.wordId = wordId;

    const [total, avgAccuracy, scoreDistribution] = await Promise.all([
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
          },
        },
      ]),
      PronunciationEvaluation.aggregate([
        { $match: filter },
        {
          $bucket: {
            groupBy: '$accuracyScore',
            boundaries: [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.1],
            default: 'other',
            output: {
              count: { $sum: 1 },
            },
          },
        },
      ]),
    ]);

    const stats = {
      total,
      averages: avgAccuracy[0] || {
        avgAccuracy: 0,
        avgPronunciation: 0,
        avgFluency: 0,
        avgCompleteness: 0,
      },
      scoreDistribution,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
    return;
  } catch (error: any) {
    console.error('Error fetching evaluation stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch evaluation stats',
      error: error.message,
    });
    return;
  }
};

/**
 * Delete evaluation
 * DELETE /api/admin/stt/evaluations/:id
 */
export const deleteEvaluation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const evaluation = await PronunciationEvaluation.findByIdAndDelete(id);

    if (!evaluation) {
      res.status(404).json({ success: false, message: 'Evaluation not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Evaluation deleted successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error deleting evaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete evaluation',
      error: error.message,
    });
    return;
  }
};

/**
 * Test STT service connection
 * GET /api/admin/stt/test-connection
 */
export const testSTTConnection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await sttService.testConnection();

    res.status(200).json({
      success: true,
      data: result,
      message: 'STT service connection test completed',
    });
    return;
  } catch (error: any) {
    console.error('Error testing STT connection:', error);
    res.status(500).json({
      success: false,
      message: 'STT service connection test failed',
      error: error.message,
    });
    return;
  }
};
