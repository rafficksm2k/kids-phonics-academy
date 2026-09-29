import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { env } from '../config/env.js';
import { bumpAnalytics } from '../utils/analytics.js';
import { createDownloadToken } from '../utils/downloadToken.js';
import { sendPurchaseEmail } from '../utils/mailer.js';

function stripeClient() {
  if (!env.stripeSecret) {
    const error = new Error('Stripe is not configured');
    error.status = 503;
    throw error;
  }
  return new Stripe(env.stripeSecret);
}

function razorpayClient() {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    const error = new Error('Razorpay is not configured');
    error.status = 503;
    throw error;
  }
  return new Razorpay({
    key_id: env.razorpayKeyId,
    key_secret: env.razorpayKeySecret
  });
}

function newOrderId(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`.toUpperCase();
}

async function fulfillPaidOrder(order, product) {
  if (order.paymentStatus === 'paid') {
    const token = createDownloadToken({
      orderId: order.orderId,
      productId: String(order.productId),
      email: order.customerEmail
    });
    return { order, token, alreadyPaid: true };
  }

  order.paymentStatus = 'paid';
  await order.save();
  await bumpAnalytics(order.productId, 'purchases');

  const token = createDownloadToken({
    orderId: order.orderId,
    productId: String(order.productId),
    email: order.customerEmail
  });
  const downloadUrl = `${env.clientUrl}/payment/success?token=${token}&orderId=${order.orderId}`;

  await sendPurchaseEmail({
    to: order.customerEmail,
    name: order.customerName,
    productTitle: product.title,
    downloadUrl
  });

  return { order, token, alreadyPaid: false };
}

export async function createStripeCheckout(req, res, next) {
  try {
    const { productId, customerName, customerEmail } = req.body;
    if (!productId || !customerName || !customerEmail) {
      return res.status(400).json({ message: 'productId, customerName and customerEmail are required' });
    }

    const product = await Product.findOne({ _id: productId, active: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const orderId = newOrderId('STR');
    const order = await Order.create({
      orderId,
      productId: product._id,
      productCode: product.productCode,
      customerName,
      customerEmail,
      amount: product.priceEUR,
      currency: 'EUR',
      paymentStatus: 'pending',
      provider: 'stripe'
    });

    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${env.clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.clientUrl}/payment/failed?reason=cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(product.priceEUR * 100),
            product_data: {
              name: product.title,
              description: product.productCode,
              images: product.thumbnailUrl ? [product.thumbnailUrl] : []
            }
          }
        }
      ],
      metadata: {
        orderId: order.orderId,
        productId: String(product._id)
      }
    });

    order.providerRef = session.id;
    await order.save();

    res.json({ checkoutUrl: session.url, orderId: order.orderId });
  } catch (error) {
    next(error);
  }
}

export async function confirmStripeSession(req, res, next) {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) {
      return res.status(400).json({ message: 'session_id is required' });
    }

    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(402).json({ message: 'Payment is not complete' });
    }

    const order = await Order.findOne({ orderId: session.metadata.orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const product = await Product.findById(order.productId);
    const result = await fulfillPaidOrder(order, product);
    res.json({
      orderId: result.order.orderId,
      token: result.token,
      productTitle: product.title,
      customerEmail: order.customerEmail
    });
  } catch (error) {
    next(error);
  }
}

export async function stripeWebhook(req, res, next) {
  try {
    if (!env.stripeWebhookSecret) {
      return res.status(503).json({ message: 'Stripe webhook is not configured' });
    }

    const stripe = stripeClient();
    const signature = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const order = await Order.findOne({ orderId: session.metadata?.orderId });
      if (order && session.payment_status === 'paid') {
        const product = await Product.findById(order.productId);
        await fulfillPaidOrder(order, product);
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
}

export async function createRazorpayOrder(req, res, next) {
  try {
    const { productId, customerName, customerEmail } = req.body;
    if (!productId || !customerName || !customerEmail) {
      return res.status(400).json({ message: 'productId, customerName and customerEmail are required' });
    }

    const product = await Product.findOne({ _id: productId, active: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const orderId = newOrderId('RZP');
    const amountPaise = Math.round(product.priceINR * 100);
    const razorpay = razorpayClient();
    const rpOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: orderId
    });

    await Order.create({
      orderId,
      productId: product._id,
      productCode: product.productCode,
      customerName,
      customerEmail,
      amount: product.priceINR,
      currency: 'INR',
      paymentStatus: 'pending',
      provider: 'razorpay',
      providerRef: rpOrder.id
    });

    res.json({
      orderId,
      razorpayOrderId: rpOrder.id,
      amount: amountPaise,
      currency: 'INR',
      keyId: env.razorpayKeyId,
      productTitle: product.title
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyRazorpayPayment(req, res, next) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing Razorpay verification fields' });
    }

    const expected = crypto
      .createHmac('sha256', env.razorpayKeySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expected !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const order = await Order.findOne({ orderId, providerRef: razorpayOrderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const product = await Product.findById(order.productId);
    const result = await fulfillPaidOrder(order, product);
    res.json({
      orderId: result.order.orderId,
      token: result.token,
      productTitle: product.title,
      customerEmail: order.customerEmail
    });
  } catch (error) {
    next(error);
  }
}
