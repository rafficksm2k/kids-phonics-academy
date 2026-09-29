import { NavLink, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/resources', label: 'Resources' },
  { to: '/contact', label: 'Contact' }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b-4 border-mango bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sun text-2xl shadow-md">
            🔤
          </span>
          <div>
            <p className="font-display text-xl font-bold text-sky-700">Kids Phonics Academy</p>
            <p className="text-xs font-semibold text-mango">Sounds, smiles & stories</p>
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
