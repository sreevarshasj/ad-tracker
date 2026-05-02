// FILE: backend/routes/index.js
import { Router } from 'express';
import campaignRoutes from './campaigns.routes.js';
import performanceRoutes from './performance.routes.js';
import creativesRoutes from './creatives.routes.js';
import insightsRoutes from './insights.routes.js';
import filtersRoutes from './filters.routes.js';
import syncRoutes from './sync.routes.js';

const router = Router();

router.use('/campaigns', campaignRoutes);
router.use('/performance', performanceRoutes);
router.use('/creatives', creativesRoutes);
router.use('/insights', insightsRoutes);
router.use('/filters', filtersRoutes);
router.use('/sync', syncRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Ads Tracker Agent API',
    version: '1.0.0',
    endpoints: [
      '/api/campaigns',
      '/api/performance',
      '/api/creatives',
      '/api/insights',
      '/api/filters',
      '/api/sync',
    ],
  });
});

export default router;
