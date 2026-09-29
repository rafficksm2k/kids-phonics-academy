import mongoose from 'mongoose';

const productAnalyticsSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
    views: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const ProductAnalytics = mongoose.model('ProductAnalytics', productAnalyticsSchema);
