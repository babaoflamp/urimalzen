import express from 'express';
import * as comfyuiController from '../controllers/comfyuiController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * ComfyUI 연결 테스트
 * GET /api/comfyui/test
 */
router.get('/test', authenticate, requireAdmin, comfyuiController.testConnection);

/**
 * 큐 상태 확인
 * GET /api/comfyui/queue-status
 */
router.get('/queue-status', authenticate, requireAdmin, comfyuiController.getQueueStatus);

/**
 * 단어 일러스트 생성
 * POST /api/comfyui/word-illustration
 * Body: { koreanWord: string, englishDescription?: string }
 */
router.post(
  '/word-illustration',
  authenticate,
  requireAdmin,
  comfyuiController.generateWordIllustration
);

/**
 * 테마 이미지 생성
 * POST /api/comfyui/theme-image
 * Body: { theme: string, style?: 'realistic' | 'illustration' | 'minimal', width?: number, height?: number }
 */
router.post(
  '/theme-image',
  authenticate,
  requireAdmin,
  comfyuiController.generateThemeImage
);

/**
 * 커스텀 워크플로우로 이미지 생성
 * POST /api/comfyui/custom
 * Body: { workflow: any }
 */
router.post(
  '/custom',
  authenticate,
  requireAdmin,
  comfyuiController.generateCustomImage
);

export default router;
