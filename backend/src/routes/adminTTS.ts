import { Router } from 'express';
import * as adminTTSController from '../controllers/adminTTSController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication and admin privileges
router.use(authenticate);
router.use(requireAdmin);

/**
 * TTS Audio Generation Routes
 */

// Generate word audio
router.post('/generate-word-audio', adminTTSController.generateWordAudio);

// Generate example audio
router.post('/generate-example-audio', adminTTSController.generateExampleAudio);

// Generate phoneme rule audio
router.post('/generate-phoneme-audio', adminTTSController.generatePhonemeAudio);

// Batch generate audio for multiple words
router.post('/batch-generate', adminTTSController.batchGenerateAudio);

// Get all audio files (paginated)
router.get('/audio', adminTTSController.getAllAudio);

// Get audio for specific word
router.get('/word-audio/:wordId', adminTTSController.getWordAudio);

// Delete audio file
router.delete('/audio/:audioId', adminTTSController.deleteAudio);

// Test TTS service connection
router.get('/test-connection', adminTTSController.testTTSConnection);

export default router;
