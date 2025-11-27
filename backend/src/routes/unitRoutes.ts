import express from 'express';
import {
  getAllUnits,
  getUnitById,
  getUnitByNumber,
  getUnitsByLevel,
  getUnitsByCategory,
  getUnitLessons,
  getUnitLesson,
  createUnit,
  updateUnit,
  deleteUnit,
  addLessonToUnit,
} from '../controllers/unitController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes (must come before /:id to avoid conflicts)
router.get('/level/:kiipLevel', getUnitsByLevel);
router.get('/category/:category', getUnitsByCategory);
router.get('/number/:unitNumber', getUnitByNumber);

// Unit-specific routes
router.get('/:id/lessons', getUnitLessons);
router.get('/:unitId/lessons/:lessonNumber', getUnitLesson);

// Basic CRUD routes
router.get('/', getAllUnits);
router.get('/:id', getUnitById);

// Admin routes
router.post('/', authenticate, requireAdmin, createUnit);
router.put('/:id', authenticate, requireAdmin, updateUnit);
router.delete('/:id', authenticate, requireAdmin, deleteUnit);
router.post('/:id/lessons', authenticate, requireAdmin, addLessonToUnit);

export default router;
