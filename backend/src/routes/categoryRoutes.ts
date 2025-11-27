import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  getWordsByCategory,
  getCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} from '../controllers/categoryController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/name/:name', getCategoryByName);
router.get('/:id', getCategoryById);
router.get('/:id/words', getWordsByCategory);
router.get('/:id/stats', getCategoryStats);

// Admin routes
router.post('/', authenticate, requireAdmin, createCategory);
router.put('/:id', authenticate, requireAdmin, updateCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

export default router;
