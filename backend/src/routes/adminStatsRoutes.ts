import { Router } from 'express';
import * as adminStatsController from '../controllers/adminStatsController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication and admin privileges
router.use(authenticate);
router.use(requireAdmin);

/**
 * Admin Statistics Routes
 */

// Get comprehensive dashboard statistics
router.get('/dashboard', adminStatsController.getDashboardStats);

// Get user activity statistics
router.get('/users', adminStatsController.getUserStats);

// Get learning progress statistics
router.get('/learning', adminStatsController.getLearningStats);

// Get pronunciation evaluation statistics
router.get('/pronunciation', adminStatsController.getPronunciationStats);

// Get content statistics
router.get('/content', adminStatsController.getContentStats);

// Get trend data over time
router.get('/trends', adminStatsController.getTrendStats);

// Get geographic statistics
router.get('/geography', adminStatsController.getGeographyStats);

// Export statistics data
router.get('/export', adminStatsController.exportStats);

export default router;
