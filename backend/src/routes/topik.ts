import express from 'express';
import {
  getQuestions,
  getQuestionById,
  submitAnswer,
  getStatistics,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/topikController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/questions', getQuestions);
router.get('/questions/:id', getQuestionById);
router.get('/statistics', getStatistics);

// Protected routes (require authentication)
router.post('/questions/:id/submit', authenticate, submitAnswer);

// Admin routes (require authentication + admin role)
router.post('/questions', authenticate, createQuestion);
router.put('/questions/:id', authenticate, updateQuestion);
router.delete('/questions/:id', authenticate, deleteQuestion);

export default router;
