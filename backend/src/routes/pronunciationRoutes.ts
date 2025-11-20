import express from 'express';
import {
  getAllPhonemeRules,
  getPhonemeRuleById,
  analyzeWord,
  getPhonemeRuleByName,
  createPhonemeRule,
  updatePhonemeRule,
  deletePhonemeRule,
} from '../controllers/pronunciationController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/rules', getAllPhonemeRules);
router.get('/rules/name/:ruleName', getPhonemeRuleByName);
router.get('/rules/:id', getPhonemeRuleById);
router.post('/analyze', analyzeWord);

// Admin routes
router.post('/rules', authenticate, requireAdmin, createPhonemeRule);
router.put('/rules/:id', authenticate, requireAdmin, updatePhonemeRule);
router.delete('/rules/:id', authenticate, requireAdmin, deletePhonemeRule);

export default router;
