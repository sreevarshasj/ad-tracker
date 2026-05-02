// FILE: backend/routes/creatives.routes.js
import { Router } from 'express';
import { getCreatives, getCreativeById } from '../controllers/creatives.controller.js';

const router = Router();

router.get('/', getCreatives);
router.get('/:id', getCreativeById);

export default router;
