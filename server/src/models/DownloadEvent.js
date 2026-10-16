import mongoose from 'mongoose';

const downloadEventSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    productCode: { type: String, required: true },
    productTitle: { type: String, default: '' },
    category: { type: String, default: '', index: true },
    customerEmail: { type: String, default: '' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

downloadEventSchema.index({ createdAt: -1 });
downloadEventSchema.index({ productId: 1, createdAt: -1 });

export const DownloadEvent = mongoose.model('DownloadEvent', downloadEventSchema);
