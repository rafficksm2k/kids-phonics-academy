export const SITE_CONFIG = {
  facebookUrl: import.meta.env.VITE_FACEBOOK_URL || '',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || '',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || '',
  phoneNumber: import.meta.env.VITE_CONTACT_PHONE || ''
};

export function mergeSiteSettings(remote = {}) {
  return {
    facebookUrl: remote.facebookUrl || SITE_CONFIG.facebookUrl,
    instagramUrl: remote.instagramUrl || SITE_CONFIG.instagramUrl,
    contactEmail: remote.contactEmail || SITE_CONFIG.contactEmail,
    phoneNumber: remote.phoneNumber || SITE_CONFIG.phoneNumber
  };
}
