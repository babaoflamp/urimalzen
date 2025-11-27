import { Response } from 'express';
import TOPIKProgress from '../models/TOPIKProgress';
import TOPIKTestSession from '../models/TOPIKTestSession';
import { AuthRequest } from '../middleware/auth';

// Get progress for current user (overall or by level)
export const getProgress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Get all progress records for this user
    const progressRecords = await TOPIKProgress.find({ userId });

    if (progressRecords.length === 0) {
      // No progress yet, return default
      res.status(200).json({
        success: true,
        data: {
          userId,
          topikLevel: 1,
          listeningScore: 0,
          readingScore: 0,
          writingScore: 0,
          totalTests: 0,
          completedTests: 0,
          averageScore: 0,
        },
      });
      return;
    }

    // If multiple levels, return the highest level's progress
    const latestProgress = progressRecords.sort(
      (a, b) => b.topikLevel - a.topikLevel
    )[0];

    res.status(200).json({
      success: true,
      data: latestProgress,
    });
    return;
  } catch (error: any) {
    console.error('Get progress error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};

// Get progress by specific level
export const getProgressByLevel = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { topikLevel } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    let progress = await TOPIKProgress.findOne({
      userId,
      topikLevel: parseInt(topikLevel),
    });

    if (!progress) {
      // Create new progress record for this level
      progress = await TOPIKProgress.create({
        userId,
        topikLevel: parseInt(topikLevel),
        listeningScore: 0,
        readingScore: 0,
        writingScore: 0,
        totalTests: 0,
        completedTests: 0,
        averageScore: 0,
      });
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
    return;
  } catch (error: any) {
    console.error('Get progress by level error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};

// Update progress from completed session (called internally after session completion)
export const updateProgressFromSession = async (
  userId: string,
  sessionId: string
): Promise<void> => {
  try {
    const session = await TOPIKTestSession.findById(sessionId);

    if (!session || session.status !== 'completed') {
      throw new Error('Session not found or not completed');
    }

    // Find or create progress record for this user and level
    let progress = await TOPIKProgress.findOne({
      userId,
      topikLevel: session.topikLevel,
    });

    if (!progress) {
      progress = await TOPIKProgress.create({
        userId,
        topikLevel: session.topikLevel,
        listeningScore: 0,
        readingScore: 0,
        writingScore: 0,
        totalTests: 0,
        completedTests: 0,
        averageScore: 0,
      });
    }

    // Update progress using the model method
    await (progress as any).updateFromSession(session);
  } catch (error: any) {
    console.error('Update progress from session error:', error);
    throw error;
  }
};

// Get all progress records for user (all levels)
export const getAllProgress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const progressRecords = await TOPIKProgress.find({ userId }).sort({
      topikLevel: 1,
    });

    res.status(200).json({
      success: true,
      count: progressRecords.length,
      data: progressRecords,
    });
    return;
  } catch (error: any) {
    console.error('Get all progress error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};
