import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { ProductAnalytics } from '../models/ProductAnalytics.js';
import { Order } from '../models/Order.js';

const SUBCATEGORY_BY_CATEGORY = {
  'brain-exercise': ['age4to6', 'age6to8', 'age8plus'],
  phonics: ['basic', 'advanced']
};

function allowedSubCategory(category, subCategory) {
  return (SUBCATEGORY_BY_CATEGORY[category] || []).includes(subCategory);
}

function pickProductFields(body) {
  const payload = {};
  const fields = [
    'productCode',
    'title',
    'description',
    'longDescription',
    'category',
    'subCategory',
    'priceEUR',
    'priceINR',
    'thumbnailUrl',
    'pdfUrl',
    'featured',
    'active'
  ];
  for (const field of fields) {
    if (body[field] !== undefined) payload[field] = body[field];
  }
  if (payload.productCode) payload.productCode = String(payload.productCode).trim();
  if (payload.priceEUR !== undefined) payload.priceEUR = Number(payload.priceEUR);
  if (payload.priceINR !== undefined) payload.priceINR = Number(payload.priceINR);
  if (payload.featured !== undefined) payload.featured = Boolean(payload.featured);
  if (payload.active !== undefined) payload.active = Boolean(payload.active);
  return payload;
}

export async function listAdminProducts(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const search = String(req.query.search || '').trim();
    const category = String(req.query.category || '').trim();
    const status = String(req.query.status || '').trim();

    const filter = {};
    if (category) filter.category = category;
    if (status === 'active') filter.active = true;
    if (status === 'inactive') filter.active = false;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { productCode: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Product.aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'productanalytics',
            localField: '_id',
            foreignField: 'productId',
            as: 'analytics'
          }
        },
        {
          $lookup: {
            from: 'orders',
            let: { pid: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$productId', '$$pid'] }, { $eq: ['$paymentStatus', 'paid'] }]
                  }
                }
              },
              { $group: { _id: '$currency', total: { $sum: '$amount' } } }
            ],
            as: 'revenueRows'
          }
        },
        {
          $addFields: {
            views: { $ifNull: [{ $arrayElemAt: ['$analytics.views', 0] }, 0] },
            downloads: { $ifNull: [{ $arrayElemAt: ['$analytics.downloads', 0] }, 0] }
          }
        }
      ]),
      Product.countDocuments(filter)
    ]);

    const products = items.map((item) => {
      const revenue = { EUR: 0, INR: 0 };
      for (const row of item.revenueRows || []) {
        revenue[row._id] = row.total;
      }
      return {
        _id: item._id,
        productCode: item.productCode,
        title: item.title,
        description: item.description,
        longDescription: item.longDescription || '',
        category: item.category,
        subCategory: item.subCategory,
        priceEUR: item.priceEUR,
        priceINR: item.priceINR,
        thumbnailUrl: item.thumbnailUrl,
        pdfUrl: item.pdfUrl,
        featured: Boolean(item.featured),
        active: item.active,
        views: item.views,
        downloads: item.downloads,
        revenue,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
    });

    res.json({
      products,
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminProduct(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createAdminProduct(req, res, next) {
  try {
    const payload = pickProductFields(req.body);
    if (!payload.productCode || !payload.title || !payload.description || !payload.category || !payload.subCategory) {
      return res.status(400).json({ message: 'Product code, title, description, category and subcategory are required' });
    }
    if (!allowedSubCategory(payload.category, payload.subCategory)) {
      return res.status(400).json({ message: 'Subcategory does not match the selected category' });
    }
    const product = await Product.create(payload);
    await ProductAnalytics.updateOne(
      { productId: product._id },
      { $setOnInsert: { views: 0, purchases: 0, downloads: 0 } },
      { upsert: true }
    );
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      error.status = 409;
      error.message = 'A product with that product code already exists';
    }
    next(error);
  }
}

export async function updateAdminProduct(req, res, next) {
  try {
    const payload = pickProductFields(req.body);
    if (payload.category && payload.subCategory && !allowedSubCategory(payload.category, payload.subCategory)) {
      return res.status(400).json({ message: 'Subcategory does not match the selected category' });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function deleteAdminProduct(req, res, next) {
  try {
    const paid = await Order.countDocuments({ productId: req.params.id, paymentStatus: 'paid' });
    if (paid > 0) {
      const product = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json({
        message: 'Product has paid orders, so it was deactivated instead of deleted',
        product
      });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await ProductAnalytics.deleteOne({ productId: product._id });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
}
