import { Request, Response } from 'express';
import Unit from '../models/Unit';
import type { AuthRequest } from '../middleware/auth';

/**
 * Get all units
 * @route GET /api/units
 * @query kiipLevel - Optional KIIP level filter
 * @query category - Optional category filter
 * @access Public
 */
export const getAllUnits = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};

    // Optional KIIP level filter
    if (req.query.kiipLevel) {
      const kiipLevel = parseInt(req.query.kiipLevel as string);
      if (!isNaN(kiipLevel) && kiipLevel >= 0 && kiipLevel <= 5) {
        query.kiipLevel = kiipLevel;
      }
    }

    // Optional category filter
    if (req.query.category) {
      query.mainCategory = req.query.category;
    }

    const units = await Unit.find(query).sort({ kiipLevel: 1, order: 1 });

    res.status(200).json({
      success: true,
      count: units.length,
      data: units,
    });
    return;
  } catch (error: any) {
    console.error('Error getting units:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get unit by ID
 * @route GET /api/units/:id
 * @access Public
 */
export const getUnitById = async (req: Request, res: Response): Promise<void> => {
  try {
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      res.status(404).json({
        success: false,
        message: 'Unit not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: unit,
    });
    return;
  } catch (error: any) {
    console.error('Error getting unit:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get unit by unit number
 * @route GET /api/units/number/:unitNumber
 * @access Public
 */
export const getUnitByNumber = async (req: Request, res: Response): Promise<void> => {
  try {
    const unitNumber = parseInt(req.params.unitNumber);

    if (isNaN(unitNumber)) {
      res.status(400).json({
        success: false,
        message: 'Invalid unit number',
      });
      return;
    }

    const unit = await Unit.findOne({ unitNumber });

    if (!unit) {
      res.status(404).json({
        success: false,
        message: 'Unit not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: unit,
    });
    return;
  } catch (error: any) {
    console.error('Error getting unit by number:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get units by KIIP level
 * @route GET /api/units/level/:kiipLevel
 * @access Public
 */
export const getUnitsByLevel = async (req: Request, res: Response): Promise<void> => {
  try {
    const kiipLevel = parseInt(req.params.kiipLevel);

    if (isNaN(kiipLevel) || kiipLevel < 0 || kiipLevel > 5) {
      res.status(400).json({
        success: false,
        message: 'Invalid KIIP level. Must be between 0 and 5.',
      });
      return;
    }

    const units = await Unit.find({ kiipLevel }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      kiipLevel,
      count: units.length,
      data: units,
    });
    return;
  } catch (error: any) {
    console.error('Error getting units by level:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get units by category
 * @route GET /api/units/category/:category
 * @query kiipLevel - Optional KIIP level filter
 * @access Public
 */
export const getUnitsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.params.category;
    const query: any = { mainCategory: category };

    // Optional KIIP level filter
    if (req.query.kiipLevel) {
      const kiipLevel = parseInt(req.query.kiipLevel as string);
      if (!isNaN(kiipLevel) && kiipLevel >= 0 && kiipLevel <= 5) {
        query.kiipLevel = kiipLevel;
      }
    }

    const units = await Unit.find(query).sort({ kiipLevel: 1, order: 1 });

    res.status(200).json({
      success: true,
      category,
      count: units.length,
      data: units,
    });
    return;
  } catch (error: any) {
    console.error('Error getting units by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get lessons from a unit
 * @route GET /api/units/:id/lessons
 * @access Public
 */
export const getUnitLessons = async (req: Request, res: Response): Promise<void> => {
  try {
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      res.status(404).json({
        success: false,
        message: 'Unit not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      unitNumber: unit.unitNumber,
      unitTitle: unit.title,
      lessonCount: unit.lessons.length,
      data: unit.lessons,
    });
    return;
  } catch (error: any) {
    console.error('Error getting unit lessons:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get specific lesson from a unit
 * @route GET /api/units/:unitId/lessons/:lessonNumber
 * @access Public
 */
export const getUnitLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const unit = await Unit.findById(req.params.unitId);

    if (!unit) {
      res.status(404).json({
        success: false,
        message: 'Unit not found',
      });
      return;
    }

    const lessonNumber = parseInt(req.params.lessonNumber);
    if (isNaN(lessonNumber)) {
      res.status(400).json({
        success: false,
        message: 'Invalid lesson number',
      });
      return;
    }

    const lesson = unit.lessons.find((l) => l.lessonNumber === lessonNumber);

    if (!lesson) {
      res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lesson,
    });
    return;
  } catch (error: any) {
    console.error('Error getting unit lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Create new unit (Admin only)
 * @route POST /api/units
 * @access Private/Admin
 */
export const createUnit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      unitNumber,
      title,
      titleMn,
      kiipLevel,
      mainCategory,
      lessons,
      challenge,
      order,
      description,
      descriptionMn,
    } = req.body;

    // Check if unit number already exists
    const existingUnit = await Unit.findOne({ unitNumber });
    if (existingUnit) {
      res.status(400).json({
        success: false,
        message: 'Unit with this number already exists',
      });
      return;
    }

    const unit = await Unit.create({
      unitNumber,
      title,
      titleMn,
      kiipLevel,
      mainCategory,
      lessons: lessons || [],
      challenge,
      order,
      description,
      descriptionMn,
    });

    res.status(201).json({
      success: true,
      data: unit,
    });
    return;
  } catch (error: any) {
    console.error('Error creating unit:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Update unit (Admin only)
 * @route PUT /api/units/:id
 * @access Private/Admin
 */
export const updateUnit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!unit) {
      res.status(404).json({
        success: false,
        message: 'Unit not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: unit,
    });
    return;
  } catch (error: any) {
    console.error('Error updating unit:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Delete unit (Admin only)
 * @route DELETE /api/units/:id
 * @access Private/Admin
 */
export const deleteUnit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      res.status(404).json({
        success: false,
        message: 'Unit not found',
      });
      return;
    }

    await unit.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Unit deleted successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error deleting unit:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Add lesson to unit (Admin only)
 * @route POST /api/units/:id/lessons
 * @access Private/Admin
 */
export const addLessonToUnit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      res.status(404).json({
        success: false,
        message: 'Unit not found',
      });
      return;
    }

    const { lessonNumber, title, titleMn, wordIds, isReview } =
      req.body;

    // Check if lesson number already exists in this unit
    const existingLesson = unit.lessons.find((l) => l.lessonNumber === lessonNumber);
    if (existingLesson) {
      res.status(400).json({
        success: false,
        message: 'Lesson with this number already exists in this unit',
      });
      return;
    }

    unit.lessons.push({
      lessonNumber,
      title,
      titleMn,
      wordIds: wordIds || [],
      isReview: isReview || false,
    });

    await unit.save();

    res.status(201).json({
      success: true,
      data: unit,
    });
    return;
  } catch (error: any) {
    console.error('Error adding lesson to unit:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};
