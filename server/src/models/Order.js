import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productCode: { type: String, required: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, enum: ['EUR', 'INR'] },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    downloadCount: { type: Number, default: 0 },
    provider: { type: String, enum: ['stripe', 'razorpay'], required: true },
    providerRef: { type: String, default: '' }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Order = mongoose.model('Order', orderSchema);
