import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Word from '../models/Word';
import Recording from '../models/Recording';
import UserProgress from '../models/UserProgress';
import PronunciationEvaluation from '../models/PronunciationEvaluation';
import AudioContent from '../models/AudioContent';
import Ranking from '../models/Ranking';

/**
 * Get comprehensive dashboard statistics
 * GET /api/admin/stats/dashboard
 */
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    // Date filters
    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate as string);
    if (endDate) dateFilter.$lte = new Date(endDate as string);

    // Parallel queries for performance
    const [
      totalUsers,
      activeUsers,
      totalWords,
      totalRecordings,
      totalProgress,
      totalEvaluations,
      totalAudio,
      avgScore,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        updatedAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      }),
      Word.countDocuments(),
      Recording.countDocuments(),
      UserProgress.countDocuments({ completed: true }),
      PronunciationEvaluation.countDocuments(),
      AudioContent.countDocuments(),
      UserProgress.aggregate([
        { $match: { completed: true } },
        { $group: { _id: null, avgScore: { $avg: '$score' } } },
      ]),
    ]);

    // Calculate completion rate
    const totalPossibleProgress = totalUsers * totalWords;
    const completionRate =
      totalPossibleProgress > 0
        ? Math.round((totalProgress / totalPossibleProgress) * 100)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          totalWords,
          totalRecordings,
          totalProgress,
          totalEvaluations,
          totalAudio,
          avgScore: avgScore[0]?.avgScore || 0,
          completionRate,
        },
      },
    });
    return;
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message,
    });
    return;
  }
};

/**
 * Get user activity statistics
 * GET /api/admin/stats/users
 */
export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    // Date filters
    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate as string);
    if (endDate) dateFilter.$lte = new Date(endDate as string);

    // Total users
    const totalUsers = await User.countDocuments();

    // Active users (last 7 days)
    const activeUsers7d = await User.countDocuments({
      updatedAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Active users (last 30 days)
    const activeUsers30d = await User.countDocuments({
      updatedAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Registration trends
    const registrationTrends = await User.aggregate([
      ...(Object.keys(dateFilter).length > 0
        ? [{ $match: { createdAt: dateFilter } }]
        : []),
      {
        $group: {
          _id: {
            $dateToString: {
              format:
                groupBy === 'month'
                  ? '%Y-%m'
                  : groupBy === 'week'
                  ? '%Y-W%V'
                  : '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // User distribution by country
    const usersByCountry = await User.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // User distribution by region
    const usersByRegion = await User.aggregate([
      {
        $group: {
          _id: '$region',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // User distribution by KIIP level
    const usersByLevel = await User.aggregate([
      {
        $group: {
          _id: '$level.kiip',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Calculate retention rate (users who returned after first day)
    const usersWithActivity = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $project: {
          daysSinceCreation: {
            $divide: [
              { $subtract: ['$updatedAt', '$createdAt'] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          returned: {
            $sum: {
              $cond: [{ $gt: ['$daysSinceCreation', 1] }, 1, 0],
            },
          },
          total: { $sum: 1 },
        },
      },
    ]);

    const retentionRate =
      usersWithActivity[0]?.total > 0
        ? Math.round((usersWithActivity[0].returned / usersWithActivity[0].total) * 100)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers7d,
          activeUsers30d,
          retentionRate,
        },
        registrationTrends,
        usersByCountry,
        usersByRegion,
        usersByLevel,
      },
    });
    return;
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message,
    });
    return;
  }
};

/**
 * Get learning progress statistics
 * GET /api/admin/stats/learning
 */
export const getLearningStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { level, category, startDate, endDate } = req.query;

    // Build filters
    const wordFilter: any = {};
    if (level) wordFilter['level.kiip'] = parseInt(level as string);
    if (category) wordFilter.mainCategory = category;

    // Get words matching filter
    const words = await Word.find(wordFilter).select('_id');
    const wordIds = words.map((w) => w._id);

    // Date filter for progress
    const progressFilter: any = { wordId: { $in: wordIds } };
    if (startDate || endDate) {
      progressFilter.lastAttemptAt = {};
      if (startDate) progressFilter.lastAttemptAt.$gte = new Date(startDate as string);
      if (endDate) progressFilter.lastAttemptAt.$lte = new Date(endDate as string);
    }

    // Overall completion rate
    const [completedCount, totalProgress] = await Promise.all([
      UserProgress.countDocuments({ ...progressFilter, completed: true }),
      UserProgress.countDocuments(progressFilter),
    ]);

    const completionRate =
      totalProgress > 0 ? Math.round((completedCount / totalProgress) * 100) : 0;

    // Average score
    const avgScoreResult = await UserProgress.aggregate([
      { $match: { ...progressFilter, completed: true } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' },
          avgAttempts: { $avg: '$attempts' },
        },
      },
    ]);

    const avgScore = avgScoreResult[0]?.avgScore || 0;
    const avgAttempts = avgScoreResult[0]?.avgAttempts || 0;

    // Completion rate by KIIP level
    const completionByLevel = await Word.aggregate([
      { $match: wordFilter },
      {
        $lookup: {
          from: 'userprogresses',
          localField: '_id',
          foreignField: 'wordId',
          as: 'progress',
        },
      },
      {
        $group: {
          _id: '$level.kiip',
          totalWords: { $sum: 1 },
          completedProgress: {
            $sum: {
              $size: {
                $filter: {
                  input: '$progress',
                  as: 'p',
                  cond: { $eq: ['$$p.completed', true] },
                },
              },
            },
          },
          totalProgress: { $sum: { $size: '$progress' } },
        },
      },
      {
        $project: {
          level: '$_id',
          completionRate: {
            $cond: [
              { $gt: ['$totalProgress', 0] },
              {
                $multiply: [
                  { $divide: ['$completedProgress', '$totalProgress'] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
      { $sort: { level: 1 } },
    ]);

    // Completion rate by category
    const completionByCategory = await Word.aggregate([
      { $match: wordFilter },
      {
        $lookup: {
          from: 'userprogresses',
          localField: '_id',
          foreignField: 'wordId',
          as: 'progress',
        },
      },
      {
        $group: {
          _id: '$mainCategory',
          totalWords: { $sum: 1 },
          completedProgress: {
            $sum: {
              $size: {
                $filter: {
                  input: '$progress',
                  as: 'p',
                  cond: { $eq: ['$$p.completed', true] },
                },
              },
            },
          },
          totalProgress: { $sum: { $size: '$progress' } },
        },
      },
      {
        $project: {
          category: '$_id',
          completionRate: {
            $cond: [
              { $gt: ['$totalProgress', 0] },
              {
                $multiply: [
                  { $divide: ['$completedProgress', '$totalProgress'] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
      { $sort: { completionRate: -1 } },
      { $limit: 14 },
    ]);

    // Most practiced words
    const mostPracticedWords = await UserProgress.aggregate([
      { $match: progressFilter },
      {
        $group: {
          _id: '$wordId',
          totalAttempts: { $sum: '$attempts' },
          avgScore: { $avg: '$score' },
        },
      },
      { $sort: { totalAttempts: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'words',
          localField: '_id',
          foreignField: '_id',
          as: 'word',
        },
      },
      { $unwind: '$word' },
      {
        $project: {
          wordId: '$_id',
          koreanWord: '$word.koreanWord',
          mongolianWord: '$word.mongolianWord',
          totalAttempts: 1,
          avgScore: 1,
        },
      },
    ]);

    // Least practiced words (words with no progress)
    const leastPracticedWords = await Word.aggregate([
      { $match: wordFilter },
      {
        $lookup: {
          from: 'userprogresses',
          localField: '_id',
          foreignField: 'wordId',
          as: 'progress',
        },
      },
      {
        $match: {
          progress: { $size: 0 },
        },
      },
      { $limit: 10 },
      {
        $project: {
          wordId: '$_id',
          koreanWord: 1,
          mongolianWord: 1,
          level: '$level.kiip',
          category: '$mainCategory',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          completionRate,
          avgScore: Math.round(avgScore),
          avgAttempts: Math.round(avgAttempts * 10) / 10,
          totalCompleted: completedCount,
          totalInProgress: totalProgress - completedCount,
        },
        completionByLevel,
        completionByCategory,
        mostPracticedWords,
        leastPracticedWords,
      },
    });
    return;
  } catch (error: any) {
    console.error('Error fetching learning stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch learning statistics',
      error: error.message,
    });
    return;
  }
};

/**
 * Get pronunciation evaluation statistics
 * GET /api/admin/stats/pronunciation
 */
export const getPronunciationStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    // Date filters
    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate as string);
    if (endDate) dateFilter.$lte = new Date(endDate as string);

    const evaluationFilter: any = {};
    if (Object.keys(dateFilter).length > 0) {
      evaluationFilter.createdAt = dateFilter;
    }

    // Overall statistics
    const [totalEvaluations, avgScores, scoreDistribution] = await Promise.all([
      PronunciationEvaluation.countDocuments(evaluationFilter),
      PronunciationEvaluation.aggregate([
        { $match: evaluationFilter },
        {
          $group: {
            _id: null,
            avgPronunciation: { $avg: '$pronunciationScore' },
            avgFluency: { $avg: '$fluencyScore' },
            avgCompleteness: { $avg: '$completenessScore' },
            avgOverall: {
              $avg: {
                $divide: [
                  {
                    $add: [
                      '$pronunciationScore',
                      '$fluencyScore',
                      '$completenessScore',
                    ],
                  },
                  3,
                ],
              },
            },
          },
        },
      ]),
      PronunciationEvaluation.aggregate([
        { $match: evaluationFilter },
        {
          $project: {
            overallScore: {
              $divide: [
                {
                  $add: [
                    '$pronunciationScore',
                    '$fluencyScore',
                    '$completenessScore',
                  ],
                },
                3,
              ],
            },
          },
        },
        {
          $bucket: {
            groupBy: '$overallScore',
            boundaries: [0, 60, 80, 100],
            default: 'other',
            output: {
              count: { $sum: 1 },
            },
          },
        },
      ]),
    ]);

    // Score trends over time
    const scoreTrends = await PronunciationEvaluation.aggregate([
      { $match: evaluationFilter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          avgScore: {
            $avg: {
              $divide: [
                {
                  $add: [
                    '$pronunciationScore',
                    '$fluencyScore',
                    '$completenessScore',
                  ],
                },
                3,
              ],
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Most difficult words (most re-recordings)
    const difficultWords = await Recording.aggregate([
      {
        $group: {
          _id: '$wordId',
          recordingCount: { $sum: 1 },
        },
      },
      { $sort: { recordingCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'words',
          localField: '_id',
          foreignField: '_id',
          as: 'word',
        },
      },
      { $unwind: '$word' },
      {
        $lookup: {
          from: 'pronunciationevaluations',
          localField: '_id',
          foreignField: 'wordId',
          as: 'evaluations',
        },
      },
      {
        $project: {
          wordId: '$_id',
          koreanWord: '$word.koreanWord',
          mongolianWord: '$word.mongolianWord',
          recordingCount: 1,
          avgScore: {
            $avg: {
              $map: {
                input: '$evaluations',
                as: 'eval',
                in: {
                  $divide: [
                    {
                      $add: [
                        '$$eval.pronunciationScore',
                        '$$eval.fluencyScore',
                        '$$eval.completenessScore',
                      ],
                    },
                    3,
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    // Total recordings and storage
    const [totalRecordings, storageStats] = await Promise.all([
      Recording.countDocuments(),
      Recording.aggregate([
        {
          $group: {
            _id: null,
            totalSize: { $sum: '$fileSize' },
            avgDuration: { $avg: '$duration' },
            totalDuration: { $sum: '$duration' },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalEvaluations,
          avgPronunciation: Math.round(avgScores[0]?.avgPronunciation || 0),
          avgFluency: Math.round(avgScores[0]?.avgFluency || 0),
          avgCompleteness: Math.round(avgScores[0]?.avgCompleteness || 0),
          avgOverall: Math.round(avgScores[0]?.avgOverall || 0),
          totalRecordings,
          totalStorageMB: Math.round(
            (storageStats[0]?.totalSize || 0) / (1024 * 1024)
          ),
          avgDurationSeconds: Math.round(storageStats[0]?.avgDuration || 0),
        },
        scoreDistribution: scoreDistribution.map((bucket: any) => ({
          range:
            bucket._id === 0
              ? '0-59'
              : bucket._id === 60
              ? '60-79'
              : bucket._id === 80
              ? '80-100'
              : 'other',
          count: bucket.count,
        })),
        scoreTrends,
        difficultWords,
      },
    });
    return;
  } catch (error: any) {
    console.error('Error fetching pronunciation stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pronunciation statistics',
      error: error.message,
    });
    return;
  }
};

/**
 * Get content statistics
 * GET /api/admin/stats/content
 */
export const getContentStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Total words
    const totalWords = await Word.countDocuments();

    // Words by KIIP level
    const wordsByLevel = await Word.aggregate([
      {
        $group: {
          _id: '$level.kiip',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Words by category
    const wordsByCategory = await Word.aggregate([
      {
        $group: {
          _id: '$mainCategory',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 14 },
    ]);

    // Words with/without images
    const [wordsWithImage, wordsWithoutImage] = await Promise.all([
      Word.countDocuments({ imageUrl: { $exists: true, $ne: null } }),
      Word.countDocuments({
        $or: [{ imageUrl: { $exists: false } }, { imageUrl: null }],
      }),
    ]);

    // Total audio content
    const [totalAudio, audioStats] = await Promise.all([
      AudioContent.countDocuments(),
      AudioContent.aggregate([
        {
          $group: {
            _id: null,
            totalSize: { $sum: '$fileSize' },
            avgDuration: { $avg: '$duration' },
            adminGenerated: {
              $sum: { $cond: [{ $eq: ['$generatedBy', 'admin'] }, 1, 0] },
            },
            autoGenerated: {
              $sum: { $cond: [{ $eq: ['$generatedBy', 'auto'] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    // Audio by type
    const audioByType = await AudioContent.aggregate([
      {
        $group: {
          _id: '$audioType',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Words by difficulty
    const wordsByDifficulty = await Word.aggregate([
      {
        $bucket: {
          groupBy: '$difficultyScore',
          boundaries: [0, 30, 60, 80, 100],
          default: 'unscored',
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalWords,
          wordsWithImage,
          wordsWithoutImage,
          imageCompletionRate: Math.round((wordsWithImage / totalWords) * 100),
          totalAudio,
          audioStorageMB: Math.round(
            (audioStats[0]?.totalSize || 0) / (1024 * 1024)
          ),
          avgAudioDuration: Math.round(audioStats[0]?.avgDuration || 0),
          adminGenerated: audioStats[0]?.adminGenerated || 0,
          autoGenerated: audioStats[0]?.autoGenerated || 0,
        },
        wordsByLevel,
        wordsByCategory,
        audioByType,
        wordsByDifficulty: wordsByDifficulty.map((bucket: any) => ({
          range:
            bucket._id === 0
              ? '0-29 (Easy)'
              : bucket._id === 30
              ? '30-59 (Medium)'
              : bucket._id === 60
              ? '60-79 (Hard)'
              : bucket._id === 80
              ? '80-100 (Very Hard)'
              : 'Unscored',
          count: bucket.count,
        })),
      },
    });
    return;
  } catch (error: any) {
    console.error('Error fetching content stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content statistics',
      error: error.message,
    });
    return;
  }
};

/**
 * Get trend data over time
 * GET /api/admin/stats/trends
 */
export const getTrendStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = parseInt(days as string);
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    // Daily active users
    const dailyActiveUsers = await User.aggregate([
      {
        $match: {
          updatedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$updatedAt',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Daily new registrations
    const dailyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Daily progress completion
    const dailyCompletion = await UserProgress.aggregate([
      {
        $match: {
          lastAttemptAt: { $gte: startDate },
          completed: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$lastAttemptAt',
            },
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Daily recordings
    const dailyRecordings = await Recording.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        dailyActiveUsers,
        dailyRegistrations,
        dailyCompletion,
        dailyRecordings,
      },
    });
    return;
  } catch (error: any) {
    console.error('Error fetching trend stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trend statistics',
      error: error.message,
    });
    return;
  }
};

/**
 * Get geographic statistics
 * GET /api/admin/stats/geography
 */
export const getGeographyStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Users by country
    const usersByCountry = await User.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Users by region (for top country)
    const usersByRegion = await User.aggregate([
      {
        $match: {
          country: usersByCountry[0]?._id || 'Mongolia',
        },
      },
      {
        $group: {
          _id: '$region',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Learning performance by country
    const performanceByCountry = await User.aggregate([
      {
        $group: {
          _id: '$country',
          avgScore: { $avg: '$totalScore' },
          userCount: { $sum: 1 },
        },
      },
      { $sort: { avgScore: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        usersByCountry,
        usersByRegion,
        performanceByCountry,
      },
    });
    return;
  } catch (error: any) {
    console.error('Error fetching geography stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch geography statistics',
      error: error.message,
    });
    return;
  }
};

/**
 * Export statistics data
 * GET /api/admin/stats/export
 */
export const exportStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type = 'dashboard', format = 'json' } = req.query;

    let data: any = {};

    switch (type) {
      case 'users':
        const users = await User.find()
          .select('-password')
          .sort({ createdAt: -1 })
          .lean();
        data = users;
        break;

      case 'words':
        const words = await Word.find().sort({ order: 1 }).lean();
        data = words;
        break;

      case 'progress':
        const progress = await UserProgress.find()
          .populate('userId', 'username email')
          .populate('wordId', 'koreanWord mongolianWord')
          .sort({ lastAttemptAt: -1 })
          .lean();
        data = progress;
        break;

      case 'evaluations':
        const evaluations = await PronunciationEvaluation.find()
          .populate('userId', 'username email')
          .populate('wordId', 'koreanWord mongolianWord')
          .sort({ createdAt: -1 })
          .lean();
        data = evaluations;
        break;

      default:
        // Dashboard data
        const dashboardStats = await getDashboardData();
        data = dashboardStats;
    }

    if (format === 'csv') {
      // Convert to CSV (simplified - would need proper CSV library for production)
      const csv = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}-stats.csv"`);
      res.status(200).send(csv);
      return;
    } else {
      // JSON format
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${type}-stats.json"`
      );
      res.status(200).json({
        success: true,
        data,
        exportedAt: new Date().toISOString(),
      });
      return;
    }
  } catch (error: any) {
    console.error('Error exporting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export statistics',
      error: error.message,
    });
    return;
  }
};

// Helper function to get dashboard data
async function getDashboardData() {
  const [users, words, recordings, progress, evaluations, audio] = await Promise.all([
    User.countDocuments(),
    Word.countDocuments(),
    Recording.countDocuments(),
    UserProgress.countDocuments({ completed: true }),
    PronunciationEvaluation.countDocuments(),
    AudioContent.countDocuments(),
  ]);

  return {
    users,
    words,
    recordings,
    progress,
    evaluations,
    audio,
    timestamp: new Date().toISOString(),
  };
}

// Helper function to convert data to CSV
function convertToCSV(data: any[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]).join(',');
  const rows = data
    .map((row) =>
      Object.values(row)
        .map((val) => (typeof val === 'string' ? `"${val}"` : val))
        .join(',')
    )
    .join('\n');

  return `${headers}\n${rows}`;
}
