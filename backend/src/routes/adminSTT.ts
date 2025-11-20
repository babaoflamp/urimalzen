import { Router } from 'express';
import * as adminSTTController from '../controllers/adminSTTController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication and admin privileges
router.use(authenticate);
router.use(requireAdmin);

/**
 * STT Pronunciation Evaluation Routes
 */

// Get all evaluations (paginated)
router.get('/evaluations', adminSTTController.getAllEvaluations);

// Get evaluation by ID
router.get('/evaluations/:id', adminSTTController.getEvaluationById);

// Get evaluation statistics
router.get('/stats', adminSTTController.getEvaluationStats);

// Re-evaluate a recording
router.post('/re-evaluate', adminSTTController.reEvaluateRecording);

// Delete evaluation
router.delete('/evaluations/:id', adminSTTController.deleteEvaluation);

// Test STT service connection
router.get('/test-connection', adminSTTController.testSTTConnection);

export default router;
