export const SITE_CONFIG = {
  academyName: 'Bright Minds Academy',
  footerText:
    'Playful PDF workbooks for brain training, memory activities, concentration exercises and cognitive development.',
  logoUrl: '',
  heroBannerUrl: '',
  facebookUrl: import.meta.env.VITE_FACEBOOK_URL || '',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || '',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || '',
  phoneNumber: import.meta.env.VITE_CONTACT_PHONE || ''
};

export function mergeSiteSettings(remote = {}) {
  return {
    academyName: remote.academyName || SITE_CONFIG.academyName,
    footerText: remote.footerText || SITE_CONFIG.footerText,
    logoUrl: remote.logoUrl || SITE_CONFIG.logoUrl,
    heroBannerUrl: remote.heroBannerUrl || SITE_CONFIG.heroBannerUrl,
    facebookUrl: remote.facebookUrl || SITE_CONFIG.facebookUrl,
    instagramUrl: remote.instagramUrl || SITE_CONFIG.instagramUrl,
    contactEmail: remote.contactEmail || SITE_CONFIG.contactEmail,
    phoneNumber: remote.phoneNumber || SITE_CONFIG.phoneNumber
  };
}
