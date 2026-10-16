import { NavLink } from 'react-router-dom';
import {
  FaChartLine,
  FaBoxOpen,
  FaReceipt,
  FaChartPie,
  FaDownload,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaBars
} from 'react-icons/fa';
import BrandMark from '../components/BrandMark';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FaChartLine },
  { to: '/admin/products', label: 'Products', icon: FaBoxOpen },
  { to: '/admin/orders', label: 'Orders', icon: FaReceipt },
  { to: '/admin/analytics', label: 'Analytics', icon: FaChartPie },
  { to: '/admin/downloads', label: 'Downloads', icon: FaDownload },
  { to: '/admin/messages', label: 'Messages', icon: FaEnvelope },
  { to: '/admin/settings', label: 'Settings', icon: FaCog }
];

export default function AdminSidebar({ open, onClose, onLogout, username }) {
  return (
    <>
      {open ? (
        <button type="button" className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} aria-label="Close menu" />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-100 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <BrandMark className="h-10 w-10" />
          <div>
            <p className="font-display text-lg">Bright Minds</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold ${
                    isActive ? 'bg-sky text-white' : 'text-slate-300 hover:bg-white/10'
                  }`
                }
              >
                <Icon />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-white/10 p-4">
          <p className="mb-2 truncate text-xs text-slate-400">{username}</p>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-300 hover:bg-white/10"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export function AdminMenuButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="rounded-lg p-2 text-slate-700 hover:bg-slate-200 lg:hidden">
      <FaBars />
    </button>
  );
}
