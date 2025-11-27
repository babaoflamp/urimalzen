import express from 'express';
import {
  getAllTestSentences,
  getTestSentenceById,
  generateSpeechProModel,
  startTestSession,
  evaluatePronunciation,
  getTestSession,
  getSessionAnswers,
  getTestHistory,
  createTestSentence,
  updateTestSentence,
  deleteTestSentence,
  upload,
} from '../controllers/pronunciationTestController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { exportSessionToExcel } from '../controllers/pronunciationTestExportController';

const router = express.Router();

// Public routes
router.get('/sentences', getAllTestSentences);
router.get('/sentences/:id', getTestSentenceById);

// Protected routes (require authentication)
router.post('/session/start', authenticate, startTestSession);
router.post('/evaluate', authenticate, upload.single('audioFile'), evaluatePronunciation);
router.get('/session/:id', authenticate, getTestSession);
router.get('/session/:id/answers', authenticate, getSessionAnswers);
router.get('/session/:id/export', authenticate, exportSessionToExcel);
router.get('/history', authenticate, getTestHistory);

// Admin routes (require authentication + admin)
router.post('/sentences', authenticate, requireAdmin, createTestSentence);
router.put('/sentences/:id', authenticate, requireAdmin, updateTestSentence);
router.delete('/sentences/:id', authenticate, requireAdmin, deleteTestSentence);
router.post('/sentences/:id/generate-model', authenticate, requireAdmin, generateSpeechProModel);

export default router;
