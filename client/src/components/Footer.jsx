import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';
import { useSiteSettings } from '../hooks/useSiteSettings';

export default function Footer() {
  const settings = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t-4 border-leaf bg-sky-700 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl">{settings.academyName || 'Bright Minds Academy'}</p>
          <p className="mt-2 text-sky-100">
            {settings.footerText ||
              'Playful PDF workbooks for brain training, memory activities, concentration exercises and cognitive development.'}
          </p>
        </div>
        <div>
          <p className="font-display text-lg">Explore</p>
          <div className="mt-2 flex flex-col gap-1">
            <Link to="/">Home</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="font-display text-lg">Say hello</p>
          {settings.contactEmail ? <p className="mt-2">{settings.contactEmail}</p> : null}
          {settings.phoneNumber ? <p>{settings.phoneNumber}</p> : null}
        </div>
      </div>
      <div className="border-t border-white/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row">
          <p className="text-sm text-sky-100">© {year} {settings.academyName || 'Bright Minds Academy'}. All rights reserved.</p>
          <SocialLinks facebookUrl={settings.facebookUrl} instagramUrl={settings.instagramUrl} />
        </div>
      </div>
    </footer>
  );
}
