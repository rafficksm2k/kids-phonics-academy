import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-leaf bg-sky-700 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Kids Phonics Academy</p>
          <p className="mt-2 text-sky-100">Playful PDF workbooks that help children map letters to sounds.</p>
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
          <p className="mt-2">{import.meta.env.VITE_CONTACT_EMAIL || 'your-email@example.com'}</p>
          <p>{import.meta.env.VITE_CONTACT_PHONE || '+49 xxxx xxxx'}</p>
        </div>
      </div>
    </footer>
  );
}
