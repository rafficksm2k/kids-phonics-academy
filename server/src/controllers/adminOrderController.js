import { Order } from '../models/Order.js';

export async function listAdminOrders(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const category = String(req.query.category || '').trim();
    const product = String(req.query.product || '').trim();
    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;

    const match = {};
    if (product) {
      match.$or = [
        { productCode: { $regex: product, $options: 'i' } },
        { customerName: { $regex: product, $options: 'i' } },
        { customerEmail: { $regex: product, $options: 'i' } },
        { orderId: { $regex: product, $options: 'i' } }
      ];
    }
    if (from || to) {
      match.createdAt = {};
      if (from && !Number.isNaN(from.getTime())) match.createdAt.$gte = from;
      if (to && !Number.isNaN(to.getTime())) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        match.createdAt.$lte = end;
      }
    }

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
    ];
    if (category) {
      pipeline.push({ $match: { 'product.category': category } });
    }

    const skip = (page - 1) * limit;
    const [countRow, orders] = await Promise.all([
      Order.aggregate([...pipeline, { $count: 'total' }]),
      Order.aggregate([
        ...pipeline,
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ])
    ]);

    const total = countRow[0]?.total || 0;
    res.json({
      orders: orders.map((order) => ({
        _id: order._id,
        orderId: order.orderId,
        productId: order.product
          ? {
              _id: order.product._id,
              title: order.product.title,
              productCode: order.product.productCode,
              category: order.product.category,
              subCategory: order.product.subCategory,
              thumbnailUrl: order.product.thumbnailUrl
            }
          : null,
        productCode: order.productCode,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        amount: order.amount,
        currency: order.currency,
        paymentStatus: order.paymentStatus,
        downloadCount: order.downloadCount,
        createdAt: order.createdAt
      })),
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
    });
  } catch (error) {
    next(error);
  }
}
