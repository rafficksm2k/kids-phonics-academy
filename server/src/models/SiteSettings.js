import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    academyName: { type: String, default: 'Bright Minds Academy' },
    footerText: {
      type: String,
      default:
        'Playful PDF workbooks for brain training, memory activities, concentration exercises and cognitive development.'
    },
    logoUrl: { type: String, default: '' },
    heroBannerUrl: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    phoneNumber: { type: String, default: '' }
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
