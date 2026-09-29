import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { signedPdfUrl } from '../config/cloudinary.js';
import { bumpAnalytics } from '../utils/analytics.js';
import { verifyDownloadToken } from '../utils/downloadToken.js';

export async function downloadPdf(req, res, next) {
  try {
    const payload = verifyDownloadToken(req.params.token);
    const order = await Order.findOne({ orderId: payload.orderId, paymentStatus: 'paid' });
    if (!order) {
      return res.status(403).json({ message: 'Order is not available for download' });
    }

    const product = await Product.findById(order.productId);
    if (!product?.pdfUrl) {
      return res.status(404).json({ message: 'PDF is not available yet' });
    }

    order.downloadCount += 1;
    await order.save();
    await bumpAnalytics(product._id, 'downloads');

    const url = signedPdfUrl(product.pdfUrl);
    res.json({
      url,
      fileName: `${product.productCode}.pdf`,
      title: product.title,
      downloadCount: order.downloadCount
    });
  } catch (error) {
    error.status = 401;
    error.message = 'Invalid or expired download link';
    next(error);
  }
}
