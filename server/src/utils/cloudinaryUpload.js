import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

export function uploadBufferToCloudinary(buffer, { folder, resourceType = 'image' }) {
  if (!isCloudinaryConfigured()) {
    const error = new Error('Cloudinary is not configured');
    error.status = 503;
    throw error;
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        overwrite: false
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}
