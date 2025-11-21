import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import User from '../models/User';
import Word from '../models/Word';
import Recording from '../models/Recording';
import UserProgress from '../models/UserProgress';

const router = Router();

// 모든 관리자 라우트는 인증 + 관리자 권한 필요
router.use(authenticate, requireAdmin);

// 통계 조회
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWords = await Word.countDocuments();
    const totalRecordings = await Recording.countDocuments();
    
    // 최근 7일 내 활동한 사용자
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await User.countDocuments({
      updatedAt: { $gte: sevenDaysAgo }
    });

    res.json({
      totalUsers,
      totalWords,
      totalRecordings,
      activeUsers,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// 전체 사용자 조회
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin users list error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// 특정 사용자 조회
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Admin user detail error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// 사용자 관리자 권한 업데이트
router.patch('/users/:id/admin', async (req, res) => {
  try {
    const { isAdmin } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Admin user update error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// 사용자 정보 업데이트
router.put('/users/:id', async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Admin user update error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// 사용자 삭제
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // 연관된 데이터도 삭제
    await Promise.all([
      UserProgress.deleteMany({ userId: req.params.id }),
      Recording.deleteMany({ userId: req.params.id }),
    ]);

    res.json({ message: 'User and related data deleted successfully' });
  } catch (error) {
    console.error('Admin user delete error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// 사용자 검색
router.get('/users/search', async (req, res) => {
  try {
    const { q, level, country, region, isAdmin } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (q) {
      filter.$or = [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }

    if (level) filter['level.kiip'] = parseInt(level as string);
    if (country) filter.country = country;
    if (region) filter.region = region;
    if (isAdmin !== undefined) filter.isAdmin = isAdmin === 'true';

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin user search error:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});

// 사용자 학습 진행 상황 조회
router.get('/users/:id/progress', async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.params.id })
      .populate('wordId', 'koreanWord mongolianWord level mainCategory')
      .sort({ lastAttemptAt: -1 });

    const stats = {
      totalWords: progress.length,
      completedWords: progress.filter(p => p.completed).length,
      averageScore: progress.reduce((sum, p) => sum + p.score, 0) / progress.length || 0,
      totalAttempts: progress.reduce((sum, p) => sum + p.attempts, 0),
    };

    res.json({
      progress,
      stats,
    });
  } catch (error) {
    console.error('Admin user progress error:', error);
    res.status(500).json({ message: 'Failed to fetch user progress' });
  }
});

// 전체 단어 조회
router.get('/words', async (req, res) => {
  try {
    const words = await Word.find().sort({ order: 1 });
    res.json(words);
  } catch (error) {
    console.error('Admin words list error:', error);
    res.status(500).json({ message: 'Failed to fetch words' });
  }
});

// 단어 생성
router.post('/words', async (req, res) => {
  try {
    const word = new Word(req.body);
    await word.save();
    res.status(201).json(word);
  } catch (error) {
    console.error('Admin word create error:', error);
    res.status(500).json({ message: 'Failed to create word' });
  }
});

// 단어 수정
router.put('/words/:id', async (req, res) => {
  try {
    const word = await Word.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!word) {
      res.status(404).json({ message: 'Word not found' });
      return;
    }

    res.json(word);
  } catch (error) {
    console.error('Admin word update error:', error);
    res.status(500).json({ message: 'Failed to update word' });
  }
});

// 단어 삭제
router.delete('/words/:id', async (req, res) => {
  try {
    const word = await Word.findByIdAndDelete(req.params.id);

    if (!word) {
      res.status(404).json({ message: 'Word not found' });
      return;
    }

    res.json({ message: 'Word deleted successfully' });
  } catch (error) {
    console.error('Admin word delete error:', error);
    res.status(500).json({ message: 'Failed to delete word' });
  }
});

// 전체 녹음 조회
router.get('/recordings', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const recordings = await Recording.find()
      .populate('userId', 'username email')
      .populate('wordId', 'koreanWord mongolianWord')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Recording.countDocuments();

    res.json({
      recordings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin recordings list error:', error);
    res.status(500).json({ message: 'Failed to fetch recordings' });
  }
});

// 녹음 삭제
router.delete('/recordings/:id', async (req, res) => {
  try {
    const recording = await Recording.findByIdAndDelete(req.params.id);

    if (!recording) {
      res.status(404).json({ message: 'Recording not found' });
      return;
    }

    res.json({ message: 'Recording deleted successfully' });
  } catch (error) {
    console.error('Admin recording delete error:', error);
    res.status(500).json({ message: 'Failed to delete recording' });
  }
});

// 녹음 검색
router.get('/recordings/search', async (req, res) => {
  try {
    const { userId, wordId, startDate, endDate } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (userId) filter.userId = userId;
    if (wordId) filter.wordId = wordId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const recordings = await Recording.find(filter)
      .populate('userId', 'username email')
      .populate('wordId', 'koreanWord mongolianWord')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Recording.countDocuments(filter);

    res.json({
      recordings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin recording search error:', error);
    res.status(500).json({ message: 'Failed to search recordings' });
  }
});

export default router;
