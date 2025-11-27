import express from 'express';
import { getUserProgress, updateProgress } from '../controllers/progressController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getUserProgress);
router.post('/', authenticate, updateProgress);

export default router;
