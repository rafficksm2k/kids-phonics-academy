import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, me } from '../controllers/adminAuthController.js';
import { getDashboard } from '../controllers/adminDashboardController.js';
import {
  listAdminProducts,
  getAdminProduct,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct
} from '../controllers/adminProductController.js';
import { listAdminOrders } from '../controllers/adminOrderController.js';
import { getAnalytics } from '../controllers/adminAnalyticsController.js';
import { listMessages } from '../controllers/adminMessageController.js';
import { uploadMemory, uploadThumbnail, uploadPdf, uploadImage } from '../controllers/uploadController.js';
import { getPublicSettings, updateSettings } from '../controllers/settingsController.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: 'Too many login attempts. Try again later.' }
});

router.post('/login', loginLimiter, login);
router.get('/me', requireAdminAuth, me);
router.get('/dashboard', requireAdminAuth, getDashboard);
router.get('/products', requireAdminAuth, listAdminProducts);
router.get('/products/:id', requireAdminAuth, getAdminProduct);
router.post('/products', requireAdminAuth, createAdminProduct);
router.put('/products/:id', requireAdminAuth, updateAdminProduct);
router.delete('/products/:id', requireAdminAuth, deleteAdminProduct);
router.get('/orders', requireAdminAuth, listAdminOrders);
router.get('/analytics', requireAdminAuth, getAnalytics);
router.get('/messages', requireAdminAuth, listMessages);
router.get('/settings', requireAdminAuth, getPublicSettings);
router.put('/settings', requireAdminAuth, updateSettings);
router.post('/uploads/thumbnail', requireAdminAuth, uploadMemory.single('file'), uploadThumbnail);
router.post('/uploads/pdf', requireAdminAuth, uploadMemory.single('file'), uploadPdf);
router.post('/uploads/image', requireAdminAuth, uploadMemory.single('file'), uploadImage);

export default router;
