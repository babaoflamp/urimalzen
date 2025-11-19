import express from 'express';
import {
  getAllWords,
  getWordById,
  getWordByOrder,
  createWord,
} from '../controllers/wordController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllWords);
router.get('/:id', getWordById);
router.get('/order/:order', getWordByOrder);
router.post('/', authenticate, createWord);

export default router;
