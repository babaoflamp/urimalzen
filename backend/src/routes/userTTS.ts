import { Router } from 'express';
import * as userTTSController from '../controllers/userTTSController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * User TTS Routes
 */

// Get audio for a word
router.get('/word/:wordId', userTTSController.getWordAudio);

// Get audio for word example
router.get('/example/:wordId/:exampleIndex', userTTSController.getExampleAudio);

// Get all audio for a word
router.get('/word-all/:wordId', userTTSController.getAllWordAudio);

// Generate real-time TTS
router.post('/generate', userTTSController.generateRealTimeTTS);

export default router;
