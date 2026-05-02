// FILE: backend/routes/filters.routes.js
import { Router } from 'express';
import { getCountries, getStates, getCities, getPlatforms } from '../controllers/campaigns.controller.js';

const router = Router();

router.get('/countries', getCountries);
router.get('/states', getStates);
router.get('/cities', getCities);
router.get('/platforms', getPlatforms);

export default router;
