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

/**
 * PDFs uploaded in Cloudinary Media Library usually live at:
 *   https://res.cloudinary.com/{cloud}/image/upload/v123/file.pdf
 * not under resource_type "raw". private_download_url(..., { resource_type: 'raw' })
 * looks up a different asset and returns "Resource not found".
 */
export function signedPdfUrl(pdfUrl, expiresInSeconds = 300) {
  if (!pdfUrl) return null;

  const parsed = parseCloudinaryDeliveryUrl(pdfUrl);
  if (!parsed) return pdfUrl;

  if (parsed.deliveryType === 'upload') {
    return withAttachmentFlag(pdfUrl);
  }

  if (!isCloudinaryConfigured()) return pdfUrl;

  try {
    return cloudinary.utils.private_download_url(parsed.publicId, parsed.format || 'pdf', {
      resource_type: parsed.resourceType,
      type: parsed.deliveryType,
      expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
      attachment: true
    });
  } catch (error) {
    console.error('Cloudinary signed URL failed, falling back to stored URL', error);
    return pdfUrl;
  }
}

function withAttachmentFlag(pdfUrl) {
  try {
    const parsed = new URL(pdfUrl);
    parsed.pathname = parsed.pathname.replace(/\/upload\/(?!fl_attachment)/, '/upload/fl_attachment/');
    return parsed.toString();
  } catch {
    return pdfUrl;
  }
}

function parseCloudinaryDeliveryUrl(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('cloudinary.com')) return null;

    const parts = parsed.pathname.split('/').filter(Boolean);
    const resourceIndex = parts.findIndex((part) => ['image', 'raw', 'video', 'auto'].includes(part));
    if (resourceIndex === -1 || !parts[resourceIndex + 1]) return null;

    const resourceType = parts[resourceIndex];
    const deliveryType = parts[resourceIndex + 1];
    let rest = parts.slice(resourceIndex + 2);

    while (rest.length > 1 && !/^v\d+$/.test(rest[0])) {
      rest = rest.slice(1);
    }
    if (rest[0] && /^v\d+$/.test(rest[0])) {
      rest = rest.slice(1);
    }

    const filename = decodeURIComponent(rest.join('/'));
    if (!filename) return null;

    const dot = filename.lastIndexOf('.');
    const format = dot > 0 ? filename.slice(dot + 1) : '';
    const publicIdWithoutExt = dot > 0 ? filename.slice(0, dot) : filename;
    const publicId = resourceType === 'raw' ? filename : publicIdWithoutExt;

    return { resourceType, deliveryType, publicId, format };
  } catch {
    return null;
  }
}

export { cloudinary };
