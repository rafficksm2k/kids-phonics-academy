import { Product } from '../models/Product.js';
import { bumpAnalytics } from '../utils/analytics.js';

const PUBLIC_FIELDS = [
  'productCode',
  'title',
  'description',
  'category',
  'priceEUR',
  'priceINR',
  'thumbnailUrl',
  'active',
  'createdAt',
  'updatedAt'
];

function toPublicProduct(product) {
  const obj = product.toObject({ virtuals: false });
  const publicProduct = { _id: obj._id };
  for (const field of PUBLIC_FIELDS) {
    publicProduct[field] = obj[field];
  }
  publicProduct.hasPdf = Boolean(obj.pdfUrl);
  return publicProduct;
}

export async function listProducts(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(48, Math.max(1, Number(req.query.limit) || 12));
    const search = String(req.query.search || '').trim();
    const category = String(req.query.category || '').trim();

    const filter = { active: true };
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { productCode: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total, categories] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
      Product.distinct('category', { active: true })
    ]);

    res.json({
      products: items.map(toPublicProduct),
      categories: categories.sort(),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit))
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findOne({ _id: req.params.id, active: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await bumpAnalytics(product._id, 'views');
    res.json(toPublicProduct(product));
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
}
