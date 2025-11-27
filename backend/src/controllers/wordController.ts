import { Request, Response } from 'express';
import Word from '../models/Word';
import { AuthRequest } from '../middleware/auth';

export const getAllWords = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const words = await Word.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: words.length,
      data: words,
    });
  } catch (error: any) {
    console.error('Get all words error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWordById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const word = await Word.findById(id);

    if (!word) {
      res.status(404).json({ message: 'Word not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: word,
    });
  } catch (error: any) {
    console.error('Get word by id error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWordByOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { order } = req.params;

    const word = await Word.findOne({ order: parseInt(order) });

    if (!word) {
      res.status(404).json({ message: 'Word not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: word,
    });
  } catch (error: any) {
    console.error('Get word by order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createWord = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const wordData = req.body;

    const word = await Word.create(wordData);

    res.status(201).json({
      success: true,
      data: word,
    });
  } catch (error: any) {
    console.error('Create word error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get words by KIIP level
 * @route GET /api/words/level/:kiipLevel
 * @access Public
 */
export const getWordsByLevel = async (req: Request, res: Response): Promise<void> => {
  try {
    const kiipLevel = parseInt(req.params.kiipLevel);

    if (isNaN(kiipLevel) || kiipLevel < 0 || kiipLevel > 5) {
      res.status(400).json({
        success: false,
        message: 'Invalid KIIP level. Must be between 0 and 5.',
      });
      return;
    }

    const words = await Word.find({ 'level.kiip': kiipLevel }).sort({
      mainCategory: 1,
      difficultyScore: 1,
      order: 1,
    });

    res.status(200).json({
      success: true,
      kiipLevel,
      count: words.length,
      data: words,
    });
    return;
  } catch (error: any) {
    console.error('Get words by level error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
    return;
  }
};

/**
 * Get words by category
 * @route GET /api/words/category/:category
 * @query kiipLevel - Optional KIIP level filter
 * @access Public
 */
export const getWordsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.params.category;
    const query: any = { mainCategory: category };

    // Optional KIIP level filter
    if (req.query.kiipLevel) {
      const kiipLevel = parseInt(req.query.kiipLevel as string);
      if (!isNaN(kiipLevel) && kiipLevel >= 0 && kiipLevel <= 5) {
        query['level.kiip'] = kiipLevel;
      }
    }

    // Optional sub-category filter
    if (req.query.subCategory) {
      query.subCategory = req.query.subCategory;
    }

    const words = await Word.find(query).sort({ difficultyScore: 1, order: 1 });

    res.status(200).json({
      success: true,
      category,
      count: words.length,
      data: words,
    });
    return;
  } catch (error: any) {
    console.error('Get words by category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
    return;
  }
};

/**
 * Get words by multiple criteria
 * @route GET /api/words/search
 * @query kiipLevel, category, subCategory, minDifficulty, maxDifficulty
 * @access Public
 */
export const getWordsByCriteria = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};

    // KIIP level filter
    if (req.query.kiipLevel) {
      const kiipLevel = parseInt(req.query.kiipLevel as string);
      if (!isNaN(kiipLevel) && kiipLevel >= 0 && kiipLevel <= 5) {
        query['level.kiip'] = kiipLevel;
      }
    }

    // CEFR level filter
    if (req.query.cefrLevel) {
      query['level.cefr'] = req.query.cefrLevel;
    }

    // Category filter
    if (req.query.category) {
      query.mainCategory = req.query.category;
    }

    // Sub-category filter
    if (req.query.subCategory) {
      query.subCategory = req.query.subCategory;
    }

    // Difficulty range filter
    if (req.query.minDifficulty || req.query.maxDifficulty) {
      query.difficultyScore = {};
      if (req.query.minDifficulty) {
        query.difficultyScore.$gte = parseInt(req.query.minDifficulty as string);
      }
      if (req.query.maxDifficulty) {
        query.difficultyScore.$lte = parseInt(req.query.maxDifficulty as string);
      }
    }

    // Word type filter
    if (req.query.wordType) {
      query.wordType = req.query.wordType;
    }

    const words = await Word.find(query).sort({ difficultyScore: 1, order: 1 });

    res.status(200).json({
      success: true,
      filters: req.query,
      count: words.length,
      data: words,
    });
    return;
  } catch (error: any) {
    console.error('Get words by criteria error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
    return;
  }
};

/**
 * Search words by Korean or Mongolian text
 * @route GET /api/words/search/text
 * @query q - Search query
 * @access Public
 */
export const searchWords = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchQuery = req.query.q as string;

    if (!searchQuery || searchQuery.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
      return;
    }

    // Search in Korean word, Mongolian word, and description
    const words = await Word.find({
      $or: [
        { koreanWord: { $regex: searchQuery, $options: 'i' } },
        { mongolianWord: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { pronunciation: { $regex: searchQuery, $options: 'i' } },
      ],
    }).sort({ difficultyScore: 1, order: 1 });

    res.status(200).json({
      success: true,
      query: searchQuery,
      count: words.length,
      data: words,
    });
    return;
  } catch (error: any) {
    console.error('Search words error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
    return;
  }
};
