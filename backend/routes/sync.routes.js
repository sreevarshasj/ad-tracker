// FILE: backend/routes/sync.routes.js
import { Router } from 'express';
import { triggerSync, getSyncStatus } from '../controllers/sync.controller.js';
import { syncLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/trigger', syncLimiter, triggerSync);
router.get('/status', getSyncStatus);

export default router;
