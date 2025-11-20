import { Request, Response } from 'express';
import Category from '../models/Category';
import Word from '../models/Word';
import type { AuthRequest } from '../middleware/auth';

/**
 * Get all categories
 * @route GET /api/categories
 * @access Public
 */
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
    return;
  } catch (error: any) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get category by ID
 * @route GET /api/categories/:id
 * @access Public
 */
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category,
    });
    return;
  } catch (error: any) {
    console.error('Error getting category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get words by category
 * @route GET /api/categories/:id/words
 * @query kiipLevel - Optional KIIP level filter
 * @access Public
 */
export const getWordsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    // Build query
    const query: any = { mainCategory: category.name };

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

    const words = await Word.find(query).sort({ order: 1, difficultyScore: 1 });

    res.status(200).json({
      success: true,
      category: category.name,
      count: words.length,
      data: words,
    });
    return;
  } catch (error: any) {
    console.error('Error getting words by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get category by name
 * @route GET /api/categories/name/:name
 * @access Public
 */
export const getCategoryByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findOne({ name: req.params.name });

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category,
    });
    return;
  } catch (error: any) {
    console.error('Error getting category by name:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Create new category (Admin only)
 * @route POST /api/categories
 * @access Private/Admin
 */
export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, nameEn, nameMn, order, icon, description, descriptionMn, subCategories, color } =
      req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
      return;
    }

    const category = await Category.create({
      name,
      nameEn,
      nameMn,
      order,
      icon,
      description,
      descriptionMn,
      subCategories: subCategories || [],
      color: color || '#667eea',
    });

    res.status(201).json({
      success: true,
      data: category,
    });
    return;
  } catch (error: any) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Update category (Admin only)
 * @route PUT /api/categories/:id
 * @access Private/Admin
 */
export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category,
    });
    return;
  } catch (error: any) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Delete category (Admin only)
 * @route DELETE /api/categories/:id
 * @access Private/Admin
 */
export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    // Check if there are words using this category
    const wordsCount = await Word.countDocuments({ mainCategory: category.name });
    if (wordsCount > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete category. ${wordsCount} words are using this category.`,
      });
      return;
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get category statistics
 * @route GET /api/categories/:id/stats
 * @access Public
 */
export const getCategoryStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    // Count words by KIIP level
    const wordsByLevel = await Word.aggregate([
      { $match: { mainCategory: category.name } },
      { $group: { _id: '$level.kiip', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Count words by sub-category
    const wordsBySubCategory = await Word.aggregate([
      { $match: { mainCategory: category.name } },
      { $group: { _id: '$subCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Total words count
    const totalWords = await Word.countDocuments({ mainCategory: category.name });

    res.status(200).json({
      success: true,
      data: {
        category: category.name,
        totalWords,
        wordsByLevel,
        wordsBySubCategory,
      },
    });
    return;
  } catch (error: any) {
    console.error('Error getting category stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};
