import { NavLink, Link } from 'react-router-dom';
import BrandMark from './BrandMark';
import { useSiteSettings } from '../hooks/useSiteSettings';

const links = [
  { to: '/', label: 'Home' },
  { to: '/resources', label: 'Resources' },
  { to: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const settings = useSiteSettings();
  return (
    <header className="sticky top-0 z-40 border-b-4 border-mango bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="" className="h-12 w-12 rounded-2xl object-cover shadow-md" />
          ) : (
            <BrandMark />
          )}
          <div>
            <p className="font-display text-xl font-bold text-sky-700">{settings.academyName || 'Bright Minds Academy'}</p>
            <p className="text-xs font-semibold text-mango">Think, focus, grow</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-bold sm:px-4 ${
                  isActive ? 'bg-sky text-white shadow' : 'text-sky-800 hover:bg-sun'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
