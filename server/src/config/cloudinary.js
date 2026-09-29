import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

if (env.cloudinary.cloudName) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true
  });
}

export function isCloudinaryConfigured() {
  return Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);
}

export function signedPdfUrl(pdfUrl, expiresInSeconds = 300) {
  if (!pdfUrl) return null;
  if (!isCloudinaryConfigured()) return pdfUrl;

  try {
    const publicId = extractPublicId(pdfUrl);
    if (!publicId) return pdfUrl;

    return cloudinary.utils.private_download_url(publicId, 'pdf', {
      resource_type: 'raw',
      expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
      attachment: true
    });
  } catch (error) {
    console.error('Cloudinary signed URL failed, falling back to stored URL', error);
    return pdfUrl;
  }
}

function extractPublicId(url) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/');
    const uploadIndex = parts.findIndex((part) => part === 'upload');
    if (uploadIndex === -1) return null;
    const afterUpload = parts.slice(uploadIndex + 1).join('/');
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    return decodeURIComponent(withoutVersion.replace(/\.[^/.]+$/, ''));
  } catch {
    return null;
  }
}

export { cloudinary };
