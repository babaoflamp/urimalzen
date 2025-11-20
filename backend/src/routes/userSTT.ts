import { Router } from 'express';
import * as userSTTController from '../controllers/userSTTController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * User STT Routes
 */

// Evaluate pronunciation
router.post(
  '/evaluate',
  userSTTController.upload.single('audio'),
  userSTTController.evaluatePronunciation
);

// Transcribe audio
router.post(
  '/transcribe',
  userSTTController.upload.single('audio'),
  userSTTController.transcribeAudio
);

// Get user's evaluation history
router.get('/my-evaluations', userSTTController.getMyEvaluations);

// Get user's pronunciation statistics
router.get('/my-stats', userSTTController.getMyStats);

export default router;
