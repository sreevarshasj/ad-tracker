// FILE: backend/routes/performance.routes.js
import { Router } from 'express';
import {
  getPerformanceOverview,
  getCampaignPerformance,
  getSpendTrend,
  getPlatformBreakdown,
} from '../controllers/performance.controller.js';

const router = Router();

router.get('/overview', getPerformanceOverview);
router.get('/trend', getSpendTrend);
router.get('/platforms', getPlatformBreakdown);
router.get('/:campaignId', getCampaignPerformance);

export default router;
