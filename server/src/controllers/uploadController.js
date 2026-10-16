import multer from 'multer';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

export async function uploadThumbnail(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'Thumbnail file is required' });
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'bright-minds/thumbnails',
      resourceType: 'image'
    });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    next(error);
  }
}

export async function uploadPdf(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'PDF file is required' });
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'bright-minds/pdfs',
      resourceType: 'auto'
    });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    next(error);
  }
}

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });
    const folder = req.query.folder === 'logo' ? 'bright-minds/logo' : 'bright-minds/banners';
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder,
      resourceType: 'image'
    });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    next(error);
  }
}
