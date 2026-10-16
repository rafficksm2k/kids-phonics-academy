import { Order } from '../models/Order.js';
import { ProductAnalytics } from '../models/ProductAnalytics.js';
import { DownloadEvent } from '../models/DownloadEvent.js';

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date = new Date()) {
  return new Date(date.getFullYear(), 0, 1);
}

function sumByCurrency(rows) {
  const result = { EUR: 0, INR: 0 };
  for (const row of rows) {
    result[row._id] = row.total;
  }
  return result;
}

export async function getAnalytics(req, res, next) {
  try {
    const now = new Date();
    const today = startOfDay(now);
    const month = startOfMonth(now);
    const year = startOfYear(now);

    const paidMatch = { paymentStatus: 'paid' };

    const [
      todayRev,
      monthRev,
      yearRev,
      revenueByProduct,
      revenueByCategory,
      topSelling,
      totalDownloads,
      downloadsByCategory,
      downloadsByProduct,
      mostDownloaded,
      leastDownloaded,
      recentDownloads
    ] = await Promise.all([
      Order.aggregate([
        { $match: { ...paidMatch, createdAt: { $gte: today } } },
        { $group: { _id: '$currency', total: { $sum: '$amount' } } }
      ]),
      Order.aggregate([
        { $match: { ...paidMatch, createdAt: { $gte: month } } },
        { $group: { _id: '$currency', total: { $sum: '$amount' } } }
      ]),
      Order.aggregate([
        { $match: { ...paidMatch, createdAt: { $gte: year } } },
        { $group: { _id: '$currency', total: { $sum: '$amount' } } }
      ]),
      Order.aggregate([
        { $match: paidMatch },
        { $group: { _id: { productId: '$productId', currency: '$currency' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'products',
            localField: '_id.productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
      ]),
      Order.aggregate([
        { $match: paidMatch },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
        { $group: { _id: { category: '$product.category', currency: '$currency' }, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: paidMatch },
        { $group: { _id: '$productId', count: { $sum: 1 }, inr: { $sum: { $cond: [{ $eq: ['$currency', 'INR'] }, '$amount', 0] } }, eur: { $sum: { $cond: [{ $eq: ['$currency', 'EUR'] }, '$amount', 0] } } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
      ]),
      ProductAnalytics.aggregate([{ $group: { _id: null, total: { $sum: '$downloads' } } }]),
      DownloadEvent.aggregate([{ $group: { _id: '$category', total: { $sum: 1 } } }, { $sort: { total: -1 } }]),
      ProductAnalytics.aggregate([
        { $sort: { downloads: -1 } },
        { $limit: 12 },
        { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
      ]),
      ProductAnalytics.find().sort({ downloads: -1 }).limit(8).populate('productId', 'title productCode category').lean(),
      ProductAnalytics.find().sort({ downloads: 1 }).limit(8).populate('productId', 'title productCode category').lean(),
      DownloadEvent.find().sort({ createdAt: -1 }).limit(12).lean()
    ]);

    const byProductMap = {};
    for (const row of revenueByProduct) {
      const id = String(row._id.productId);
      if (!byProductMap[id]) {
        byProductMap[id] = {
          productId: id,
          title: row.product?.title || row.product?.productCode || 'Unknown',
          category: row.product?.category || '',
          EUR: 0,
          INR: 0,
          count: 0
        };
      }
      byProductMap[id][row._id.currency] = row.total;
      byProductMap[id].count += row.count;
    }

    const byCategoryMap = {};
    for (const row of revenueByCategory) {
      const key = row._id.category || 'unknown';
      if (!byCategoryMap[key]) byCategoryMap[key] = { category: key, EUR: 0, INR: 0, count: 0 };
      byCategoryMap[key][row._id.currency] = row.total;
      byCategoryMap[key].count += row.count;
    }

    res.json({
      revenue: {
        today: sumByCurrency(todayRev),
        monthly: sumByCurrency(monthRev),
        yearly: sumByCurrency(yearRev),
        byProduct: Object.values(byProductMap),
        byCategory: Object.values(byCategoryMap),
        topSelling: topSelling.map((row) => ({
          productId: row._id,
          title: row.product?.title || 'Unknown',
          count: row.count,
          EUR: row.eur,
          INR: row.inr
        }))
      },
      downloads: {
        total: totalDownloads[0]?.total || 0,
        byCategory: downloadsByCategory.map((row) => ({
          category: row._id || 'unknown',
          total: row.total
        })),
        byProduct: downloadsByProduct
          .filter((row) => row.product)
          .map((row) => ({
            productId: row.productId,
            title: row.product.title,
            productCode: row.product.productCode,
            category: row.product.category,
            downloads: row.downloads
          })),
        mostDownloaded: mostDownloaded.filter((row) => row.productId),
        leastDownloaded: leastDownloaded.filter((row) => row.productId),
        recent: recentDownloads
      }
    });
  } catch (error) {
    next(error);
  }
}
