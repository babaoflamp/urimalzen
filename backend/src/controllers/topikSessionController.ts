import { Response } from 'express';
import TOPIKTestSession from '../models/TOPIKTestSession';
import TOPIKQuestion from '../models/TOPIKQuestion';
import { AuthRequest } from '../middleware/auth';

// Start a new test session
export const startSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { testSection, topikLevel } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Get random questions for this section and level
    const questions = await TOPIKQuestion.find({
      testSection,
      topikLevel,
    }).limit(20); // Get 20 questions per session

    if (questions.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No questions available for this level and section',
      });
      return;
    }

    // Calculate max score
    const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

    // Create new session
    const session = await TOPIKTestSession.create({
      userId,
      testSection,
      topikLevel,
      questions: questions.map((q) => q._id),
      answers: [],
      totalScore: 0,
      maxScore,
      status: 'in-progress',
    });

    // Populate questions for response
    await session.populate('questions');

    res.status(201).json({
      success: true,
      data: session,
      message: 'Session started successfully',
    });
    return;
  } catch (error: any) {
    console.error('Start session error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};

// Submit answer for a question
export const submitAnswer = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { sessionId } = req.params;
    const { questionId, userAnswer, timeSpent } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Find session
    const session = await TOPIKTestSession.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      res.status(404).json({ success: false, message: 'Session not found' });
      return;
    }

    if (session.status !== 'in-progress') {
      res.status(400).json({
        success: false,
        message: 'Session is not in progress',
      });
      return;
    }

    // Get the question
    const question = await TOPIKQuestion.findById(questionId);

    if (!question) {
      res.status(404).json({ success: false, message: 'Question not found' });
      return;
    }

    // Check if answer is correct
    let isCorrect = false;
    if (question.questionType === 'multiple-choice') {
      isCorrect = userAnswer === question.correctAnswer;
    } else {
      // For text-based answers, do simple comparison (could be enhanced with fuzzy matching)
      isCorrect =
        userAnswer.toString().toLowerCase().trim() ===
        question.correctAnswer?.toString().toLowerCase().trim();
    }

    // Check if this question was already answered
    const existingAnswerIndex = session.answers.findIndex(
      (a) => a.questionId.toString() === questionId
    );

    if (existingAnswerIndex >= 0) {
      // Update existing answer
      session.answers[existingAnswerIndex] = {
        questionId,
        userAnswer,
        isCorrect,
        timeSpent,
      };
    } else {
      // Add new answer
      session.answers.push({
        questionId,
        userAnswer,
        isCorrect,
        timeSpent,
      });
    }

    // Recalculate total score
    session.totalScore = session.answers.reduce((sum, answer) => {
      if (answer.isCorrect) {
        const q = session.questions.find(
          (qId) => qId.toString() === answer.questionId.toString()
        );
        // Find the question to get its points
        const questionDoc = question._id.toString() === answer.questionId.toString()
          ? question
          : null;
        return sum + (questionDoc?.points || 1);
      }
      return sum;
    }, 0);

    await session.save();

    // Record attempt in question statistics
    question.attemptCount += 1;
    if (isCorrect) {
      question.correctCount += 1;
    }
    question.averageScore = (question.correctCount / question.attemptCount) * 100;
    await question.save();

    res.status(200).json({
      success: true,
      data: session,
      message: 'Answer submitted successfully',
    });
    return;
  } catch (error: any) {
    console.error('Submit answer error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};

// Complete session
export const completeSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { sessionId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const session = await TOPIKTestSession.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      res.status(404).json({ success: false, message: 'Session not found' });
      return;
    }

    if (session.status !== 'in-progress') {
      res.status(400).json({
        success: false,
        message: 'Session is not in progress',
      });
      return;
    }

    session.status = 'completed';
    session.completedAt = new Date();

    await session.save();
    await session.populate('questions');

    res.status(200).json({
      success: true,
      data: session,
      message: 'Session completed successfully',
    });
    return;
  } catch (error: any) {
    console.error('Complete session error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};

// Get session by ID
export const getSessionById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { sessionId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const session = await TOPIKTestSession.findOne({
      _id: sessionId,
      userId,
    }).populate('questions');

    if (!session) {
      res.status(404).json({ success: false, message: 'Session not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: session,
    });
    return;
  } catch (error: any) {
    console.error('Get session by id error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};

// Get all sessions for current user
export const getUserSessions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { status } = req.query;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const filter: any = { userId };
    if (status) filter.status = status;

    const sessions = await TOPIKTestSession.find(filter)
      .populate('questions')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
    return;
  } catch (error: any) {
    console.error('Get user sessions error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};
