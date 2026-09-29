import { Router } from 'express';
import { downloadPdf } from '../controllers/downloadController.js';

const router = Router();
router.get('/:token', downloadPdf);

export default router;
