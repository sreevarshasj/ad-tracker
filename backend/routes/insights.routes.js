// FILE: backend/routes/insights.routes.js
import { Router } from 'express';
import { getInsights, getRankedInstitutions } from '../controllers/insights.controller.js';

const router = Router();

router.get('/', getInsights);
router.get('/rankings', getRankedInstitutions);

export default router;
