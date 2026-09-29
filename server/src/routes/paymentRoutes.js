import { Router } from 'express';
import {
  createStripeCheckout,
  confirmStripeSession,
  createRazorpayOrder,
  verifyRazorpayPayment
} from '../controllers/paymentController.js';

const router = Router();

router.post('/stripe/create-checkout', createStripeCheckout);
router.get('/stripe/confirm', confirmStripeSession);
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);

export default router;
