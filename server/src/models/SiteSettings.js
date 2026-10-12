import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    phoneNumber: { type: String, default: '' }
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
