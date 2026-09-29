import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productCode: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    priceEUR: { type: Number, required: true, min: 0 },
    priceINR: { type: Number, required: true, min: 0 },
    thumbnailUrl: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    active: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text', productCode: 'text', category: 'text' });

export const Product = mongoose.model('Product', productSchema);
