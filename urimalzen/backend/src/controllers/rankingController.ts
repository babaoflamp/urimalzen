import { Response } from 'express';
import Ranking from '../models/Ranking';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getUserRanking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user._id;

    const ranking = await Ranking.findOne({ userId }).populate(
      'userId',
      'username country region'
    );

    if (!ranking) {
      res.status(404).json({ message: 'Ranking not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: ranking,
    });
  } catch (error: any) {
    console.error('Get user ranking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getGlobalRankings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;

    const rankings = await Ranking.find()
      .sort({ score: -1 })
      .limit(limit)
      .populate('userId', 'username country region');

    res.status(200).json({
      success: true,
      count: rankings.length,
      data: rankings,
    });
  } catch (error: any) {
    console.error('Get global rankings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCountryRankings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { country } = req.params;
    const limit = parseInt(req.query.limit as string) || 100;

    const users = await User.find({ country }).select('_id');
    const userIds = users.map((u) => u._id);

    const rankings = await Ranking.find({ userId: { $in: userIds } })
      .sort({ score: -1 })
      .limit(limit)
      .populate('userId', 'username country region');

    res.status(200).json({
      success: true,
      country,
      count: rankings.length,
      data: rankings,
    });
  } catch (error: any) {
    console.error('Get country rankings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRegionRankings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { region } = req.params;
    const limit = parseInt(req.query.limit as string) || 100;

    const users = await User.find({ region }).select('_id');
    const userIds = users.map((u) => u._id);

    const rankings = await Ranking.find({ userId: { $in: userIds } })
      .sort({ score: -1 })
      .limit(limit)
      .populate('userId', 'username country region');

    res.status(200).json({
      success: true,
      region,
      count: rankings.length,
      data: rankings,
    });
  } catch (error: any) {
    console.error('Get region rankings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
