import express from 'express';

// Import Question Controllers
import {
  getAllQuestions,
  getQuestionById,
  getQuestionsByLevel,
  getQuestionsBySection,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  recordAttempt,
} from '../controllers/topikQuestionController';

// Import Session Controllers
import {
  startSession,
  submitAnswer,
  completeSession,
  getSessionById,
  getUserSessions,
} from '../controllers/topikSessionController';

// Import Progress Controllers
import {
  getProgress,
  getProgressByLevel,
  getAllProgress,
} from '../controllers/topikProgressController';

import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// ============================================================
// QUESTION ROUTES
// ============================================================

// Public question routes (no auth required)
router.get('/questions', getAllQuestions);
router.get('/questions/level/:topikLevel', getQuestionsByLevel);
router.get('/questions/section/:testSection', getQuestionsBySection);
router.get('/questions/:id', getQuestionById);

// Admin question routes (auth + admin required)
router.post('/questions', authenticate, requireAdmin, createQuestion);
router.put('/questions/:id', authenticate, requireAdmin, updateQuestion);
router.delete('/questions/:id', authenticate, requireAdmin, deleteQuestion);
router.post('/questions/:id/attempt', authenticate, recordAttempt);

// ============================================================
// SESSION ROUTES
// ============================================================

// Protected session routes (auth required)
router.post('/sessions/start', authenticate, startSession);
router.post('/sessions/:sessionId/answer', authenticate, submitAnswer);
router.post('/sessions/:sessionId/complete', authenticate, completeSession);
router.get('/sessions/:sessionId', authenticate, getSessionById);
router.get('/sessions', authenticate, getUserSessions);

// ============================================================
// PROGRESS ROUTES
// ============================================================

// Protected progress routes (auth required)
router.get('/progress', authenticate, getProgress);
router.get('/progress/level/:topikLevel', authenticate, getProgressByLevel);
router.get('/progress/all', authenticate, getAllProgress);

export default router;
