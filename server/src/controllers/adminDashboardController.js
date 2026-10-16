import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { ProductAnalytics } from '../models/ProductAnalytics.js';
import { DownloadEvent } from '../models/DownloadEvent.js';

function revenueBuckets(orders) {
  return orders.reduce(
    (acc, order) => {
      acc[order.currency] = (acc[order.currency] || 0) + order.amount;
      acc.count += 1;
      return acc;
    },
    { EUR: 0, INR: 0, count: 0 }
  );
}

export async function getDashboard(req, res, next) {
  try {
    const [
      totalProducts,
      paidOrders,
      totalMessages,
      totalDownloads,
      recentOrders,
      recentDownloads,
      topDownloads,
      topViews
    ] = await Promise.all([
      Product.countDocuments(),
      Order.find({ paymentStatus: 'paid' }).select('amount currency').lean(),
      ContactMessage.countDocuments(),
      DownloadEvent.estimatedDocumentCount().then(async (estimate) => {
        const exact = await ProductAnalytics.aggregate([{ $group: { _id: null, total: { $sum: '$downloads' } } }]);
        return exact[0]?.total || estimate || 0;
      }),
      Order.find({ paymentStatus: 'paid' })
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('productId', 'title productCode thumbnailUrl')
        .lean(),
      DownloadEvent.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      ProductAnalytics.find()
        .sort({ downloads: -1 })
        .limit(5)
        .populate('productId', 'title productCode thumbnailUrl')
        .lean(),
      ProductAnalytics.find()
        .sort({ views: -1 })
        .limit(5)
        .populate('productId', 'title productCode thumbnailUrl')
        .lean()
    ]);

    const revenue = revenueBuckets(paidOrders);

    res.json({
      cards: {
        totalProducts,
        totalOrders: paidOrders.length,
        totalRevenue: revenue,
        totalDownloads,
        totalMessages
      },
      recentOrders,
      recentDownloads,
      mostDownloaded: topDownloads.filter((row) => row.productId),
      mostViewed: topViews.filter((row) => row.productId)
    });
  } catch (error) {
    next(error);
  }
}
