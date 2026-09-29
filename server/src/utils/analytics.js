import { ProductAnalytics } from '../models/ProductAnalytics.js';

export async function bumpAnalytics(productId, field) {
  await ProductAnalytics.findOneAndUpdate(
    { productId },
    { $inc: { [field]: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}
