import mongoose from 'mongoose';

export const PRODUCT_CATEGORIES = ['phonics', 'brain-exercise'];
export const PRODUCT_SUBCATEGORIES = ['basic', 'advanced', 'age4to6', 'age6to8', 'age8plus'];

const productSchema = new mongoose.Schema(
  {
    productCode: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    longDescription: { type: String, default: '', trim: true },
    featured: { type: Boolean, default: false, index: true },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
      enum: PRODUCT_CATEGORIES
    },
    subCategory: {
      type: String,
      required: true,
      trim: true,
      index: true,
      enum: PRODUCT_SUBCATEGORIES
    },
    priceEUR: { type: Number, required: true, min: 0 },
    priceINR: { type: Number, required: true, min: 0 },
    thumbnailUrl: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    active: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

productSchema.index({
  title: 'text',
  description: 'text',
  productCode: 'text',
  category: 'text',
  subCategory: 'text'
});
productSchema.index({ category: 1, subCategory: 1, active: 1 });

export const Product = mongoose.model('Product', productSchema);
