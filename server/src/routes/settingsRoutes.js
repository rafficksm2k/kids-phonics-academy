import { Router } from 'express';
import { getPublicSettings, updateSettings } from '../controllers/settingsController.js';
import { requireAdmin } from '../middleware/errorHandler.js';

const router = Router();
router.get('/', getPublicSettings);
router.put('/', requireAdmin, updateSettings);

export default router;
