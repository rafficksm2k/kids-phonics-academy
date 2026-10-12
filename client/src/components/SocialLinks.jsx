import { FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function SocialLinks({ facebookUrl, instagramUrl, className = '' }) {
  const links = [
    {
      href: facebookUrl,
      label: 'Facebook',
      icon: FaFacebookF,
      className: 'bg-[#1877F2] hover:bg-[#0f5fcc] hover:-translate-y-1 hover:scale-110'
    },
    {
      href: instagramUrl,
      label: 'Instagram',
      icon: FaInstagram,
      className:
        'bg-[linear-gradient(45deg,#f58529,#feda75,#dd2a7b,#8134af,#515bd4)] hover:brightness-110 hover:-translate-y-1 hover:scale-110'
    }
  ].filter((link) => Boolean(link.href));

  if (!links.length) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={`grid h-11 w-11 place-items-center rounded-full text-white shadow-md transition duration-200 ${link.className}`}
          >
            <Icon className="text-lg" />
          </a>
        );
      })}
    </div>
  );
}
