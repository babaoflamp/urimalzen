import express from 'express';
import {
  getUserRanking,
  getGlobalRankings,
  getCountryRankings,
  getRegionRankings,
} from '../controllers/rankingController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/me', authenticate, getUserRanking);
router.get('/global', authenticate, getGlobalRankings);
router.get('/country/:country', authenticate, getCountryRankings);
router.get('/region/:region', authenticate, getRegionRankings);

export default router;
