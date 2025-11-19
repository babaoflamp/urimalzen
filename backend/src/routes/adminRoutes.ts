import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import User from '../models/User';
import Word from '../models/Word';
import Recording from '../models/Recording';

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
      .populate('user', 'username email')
      .populate('word', 'koreanWord mongolianWord')
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

export default router;
