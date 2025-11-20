import express from 'express';
import {
  getAllWords,
  getWordById,
  getWordByOrder,
  createWord,
  getWordsByLevel,
  getWordsByCategory,
  getWordsByCriteria,
  searchWords,
} from '../controllers/wordController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Search and filter routes (must come before /:id to avoid conflicts)
router.get('/search/text', searchWords);
router.get('/search', getWordsByCriteria);
router.get('/level/:kiipLevel', getWordsByLevel);
router.get('/category/:category', getWordsByCategory);
router.get('/order/:order', getWordByOrder);

// Basic CRUD routes
router.get('/', getAllWords);
router.get('/:id', getWordById);
router.post('/', authenticate, createWord);

export default router;
