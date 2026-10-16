import { SiteSettings } from '../models/SiteSettings.js';
import { env } from '../config/env.js';

async function getSettingsDoc() {
  let doc = await SiteSettings.findOne();
  if (!doc) {
    doc = await SiteSettings.create({});
  }
  return doc;
}

export async function getPublicSettings(req, res, next) {
  try {
    const doc = await getSettingsDoc();
    res.json(toPublicSettings(doc));
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const doc = await getSettingsDoc();
    const fields = [
      'academyName',
      'footerText',
      'logoUrl',
      'heroBannerUrl',
      'facebookUrl',
      'instagramUrl',
      'contactEmail',
      'phoneNumber'
    ];
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        doc[field] = String(req.body[field] || '').trim();
      }
    }
    await doc.save();
    res.json(toPublicSettings(doc));
  } catch (error) {
    next(error);
  }
}

function toPublicSettings(doc) {
  const facebookUrl = doc.facebookUrl || env.facebookUrl || '';
  const instagramUrl = doc.instagramUrl || env.instagramUrl || '';
  const contactEmail = doc.contactEmail || env.contactEmail || '';
  const phoneNumber = doc.phoneNumber || env.phoneNumber || '';
  return {
    academyName: doc.academyName || 'Bright Minds Academy',
    footerText:
      doc.footerText ||
      'Playful PDF workbooks for brain training, memory activities, concentration exercises and cognitive development.',
    logoUrl: doc.logoUrl || '',
    heroBannerUrl: doc.heroBannerUrl || '',
    facebookUrl,
    instagramUrl,
    contactEmail,
    phoneNumber,
    source: doc.facebookUrl || doc.instagramUrl || doc.contactEmail || doc.phoneNumber || doc.logoUrl ? 'database' : 'env'
  };
}
