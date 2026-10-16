import { Router } from 'express';
import { getPublicSettings, updateSettings } from '../controllers/settingsController.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = Router();
router.get('/', getPublicSettings);
router.put('/', requireAdminAuth, updateSettings);

export default router;
