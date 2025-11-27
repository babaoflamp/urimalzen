import { Response } from 'express';
import UserProgress from '../models/UserProgress';
import User from '../models/User';
import Ranking from '../models/Ranking';
import { AuthRequest } from '../middleware/auth';

export const getUserProgress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user._id;

    const progress = await UserProgress.find({ userId })
      .populate('wordId', 'koreanWord mongolianWord imageUrl order')
      .sort({ 'wordId.order': 1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress,
    });
  } catch (error: any) {
    console.error('Get user progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProgress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user._id;
    const { wordId, completed, score } = req.body;

    if (!wordId) {
      res.status(400).json({ message: 'Word ID is required' });
      return;
    }

    let progress = await UserProgress.findOne({ userId, wordId });

    if (!progress) {
      progress = await UserProgress.create({
        userId,
        wordId,
        completed: completed || false,
        score: score || 0,
        attempts: 1,
      });
    } else {
      if (completed !== undefined) progress.completed = completed;
      if (score !== undefined) progress.score = score;
      progress.lastAttemptAt = new Date();
      await progress.save();
    }

    // Update user total score
    const allProgress = await UserProgress.find({ userId });
    const totalScore = allProgress.reduce((sum, p) => sum + p.score, 0);

    await User.findByIdAndUpdate(userId, { totalScore });

    // Update ranking
    await updateUserRanking(userId.toString(), totalScore, allProgress.length);

    res.status(200).json({
      success: true,
      data: progress,
      totalScore,
    });
  } catch (error: any) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to update user ranking
async function updateUserRanking(
  userId: string,
  score: number,
  wordsCompleted: number
): Promise<void> {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Update ranking document
    await Ranking.findOneAndUpdate(
      { userId },
      {
        score,
        wordsCompleted,
        totalAttempts: wordsCompleted,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    // Calculate global rank
    const globalRank =
      (await Ranking.countDocuments({ score: { $gt: score } })) + 1;

    // Calculate country rank
    const usersInCountry = await User.find({
      country: user.country,
    }).select('_id');
    const userIdsInCountry = usersInCountry.map((u) => u._id);

    const countryRank =
      (await Ranking.countDocuments({
        userId: { $in: userIdsInCountry },
        score: { $gt: score },
      })) + 1;

    // Calculate Korea rank (assuming country is 'Korea' or '한국')
    const usersInKorea = await User.find({
      country: { $in: ['Korea', '한국', 'South Korea'] },
    }).select('_id');
    const userIdsInKorea = usersInKorea.map((u) => u._id);

    const koreaRank =
      (await Ranking.countDocuments({
        userId: { $in: userIdsInKorea },
        score: { $gt: score },
      })) + 1;

    // Calculate region rank
    const usersInRegion = await User.find({
      region: user.region,
    }).select('_id');
    const userIdsInRegion = usersInRegion.map((u) => u._id);

    const regionRank =
      (await Ranking.countDocuments({
        userId: { $in: userIdsInRegion },
        score: { $gt: score },
      })) + 1;

    // Update ranking with calculated ranks
    await Ranking.findOneAndUpdate(
      { userId },
      {
        globalRank,
        countryRank,
        koreaRank,
        regionRank,
      }
    );
  } catch (error) {
    console.error('Update ranking error:', error);
  }
}
