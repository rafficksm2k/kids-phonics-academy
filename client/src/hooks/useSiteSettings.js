import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { mergeSiteSettings, SITE_CONFIG } from '../config/site';

export function useSiteSettings() {
  const [settings, setSettings] = useState(SITE_CONFIG);

  useEffect(() => {
    let cancelled = false;
    api
      .getSettings()
      .then((remote) => {
        if (!cancelled) setSettings(mergeSiteSettings(remote));
      })
      .catch(() => {
        if (!cancelled) setSettings(SITE_CONFIG);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
