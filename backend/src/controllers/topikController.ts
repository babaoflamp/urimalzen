import { Request, Response } from 'express';
import TOPIKQuestion from '../models/TOPIKQuestion';
import { AuthRequest } from '../middleware/auth';

/**
 * Get TOPIK questions by level and section
 * GET /api/topik/questions?level=1&section=reading&limit=10
 */
export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { level, section, limit = 20, questionType } = req.query;

    const query: any = {};

    if (level) {
      query.topikLevel = parseInt(level as string);
    }

    if (section) {
      query.testSection = section;
    }

    if (questionType) {
      query.questionType = questionType;
    }

    const questions = await TOPIKQuestion.find(query)
      .populate('relatedWordIds', 'koreanWord mongolianWord pronunciation')
      .limit(parseInt(limit as string))
      .sort({ questionNumber: 1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
    return;
  } catch (error: any) {
    console.error('Get TOPIK questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch TOPIK questions',
      error: error.message,
    });
    return;
  }
};

/**
 * Get a single TOPIK question by ID
 * GET /api/topik/questions/:id
 */
export const getQuestionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const question = await TOPIKQuestion.findById(id).populate(
      'relatedWordIds',
      'koreanWord mongolianWord pronunciation'
    );

    if (!question) {
      res.status(404).json({
        success: false,
        message: 'Question not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      question,
    });
    return;
  } catch (error: any) {
    console.error('Get question by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question',
      error: error.message,
    });
    return;
  }
};

/**
 * Submit answer and update question statistics
 * POST /api/topik/questions/:id/submit
 * Body: { answer: string | number, isCorrect: boolean }
 */
export const submitAnswer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { answer, isCorrect } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    const question = await TOPIKQuestion.findById(id);

    if (!question) {
      res.status(404).json({
        success: false,
        message: 'Question not found',
      });
      return;
    }

    // Update question statistics
    question.attemptCount += 1;
    if (isCorrect) {
      question.correctCount += 1;
    }
    question.averageScore = (question.correctCount / question.attemptCount) * 100;

    await question.save();

    res.status(200).json({
      success: true,
      message: 'Answer submitted successfully',
      statistics: {
        attemptCount: question.attemptCount,
        correctCount: question.correctCount,
        averageScore: question.averageScore.toFixed(2),
      },
    });
    return;
  } catch (error: any) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit answer',
      error: error.message,
    });
    return;
  }
};

/**
 * Get question statistics
 * GET /api/topik/statistics?level=1&section=reading
 */
export const getStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { level, section } = req.query;

    const query: any = {};

    if (level) {
      query.topikLevel = parseInt(level as string);
    }

    if (section) {
      query.testSection = section;
    }

    const questions = await TOPIKQuestion.find(query);

    const statistics = {
      totalQuestions: questions.length,
      totalAttempts: questions.reduce((sum, q) => sum + q.attemptCount, 0),
      totalCorrect: questions.reduce((sum, q) => sum + q.correctCount, 0),
      averageScore: 0,
      byDifficulty: {
        easy: questions.filter((q) => q.difficultyScore <= 33).length,
        medium: questions.filter((q) => q.difficultyScore > 33 && q.difficultyScore <= 66).length,
        hard: questions.filter((q) => q.difficultyScore > 66).length,
      },
      byType: {} as Record<string, number>,
    };

    if (statistics.totalAttempts > 0) {
      statistics.averageScore = (statistics.totalCorrect / statistics.totalAttempts) * 100;
    }

    // Count by question type
    questions.forEach((q) => {
      statistics.byType[q.questionType] = (statistics.byType[q.questionType] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      statistics,
    });
    return;
  } catch (error: any) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
    return;
  }
};

/**
 * Create a new TOPIK question (Admin only)
 * POST /api/topik/questions
 */
export const createQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
      return;
    }

    const question = await TOPIKQuestion.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question,
    });
    return;
  } catch (error: any) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create question',
      error: error.message,
    });
    return;
  }
};

/**
 * Update a TOPIK question (Admin only)
 * PUT /api/topik/questions/:id
 */
export const updateQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
      return;
    }

    const { id } = req.params;

    const question = await TOPIKQuestion.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!question) {
      res.status(404).json({
        success: false,
        message: 'Question not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question,
    });
    return;
  } catch (error: any) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update question',
      error: error.message,
    });
    return;
  }
};

/**
 * Delete a TOPIK question (Admin only)
 * DELETE /api/topik/questions/:id
 */
export const deleteQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
      return;
    }

    const { id } = req.params;

    const question = await TOPIKQuestion.findByIdAndDelete(id);

    if (!question) {
      res.status(404).json({
        success: false,
        message: 'Question not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
    return;
  } catch (error: any) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question',
      error: error.message,
    });
    return;
  }
};
