import { Router } from 'express';
import * as adminAIController from '../controllers/adminAIController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication and admin privileges
router.use(authenticate);
router.use(requireAdmin);

/**
 * AI Content Generation Routes
 */

// Generate word description
router.post('/generate-description', adminAIController.generateWordDescription);

// Generate word examples
router.post('/generate-examples', adminAIController.generateWordExamples);

// Generate pronunciation tips
router.post('/generate-pronunciation-tips', adminAIController.generatePronunciationTips);

// Generate full content (description + examples + tips)
router.post('/generate-full-content', adminAIController.generateFullContent);

// Generate lesson content
router.post('/generate-lesson-content', adminAIController.generateLessonContent);

// Batch generate content for multiple words
router.post('/batch-generate', adminAIController.batchGenerateContent);

// Test AI service connection
router.get('/test-connection', adminAIController.testAIConnection);

export default router;
