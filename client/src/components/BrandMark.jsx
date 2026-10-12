import { FaBrain, FaLightbulb } from 'react-icons/fa';

export default function BrandMark({ className = 'h-12 w-12' }) {
  return (
    <span
      className={`relative grid place-items-center rounded-2xl bg-sun text-sky-800 shadow-md ${className}`}
      aria-hidden="true"
    >
      <FaBrain className="text-2xl" />
      <FaLightbulb className="absolute -right-1 -top-1 text-sm text-mango" />
    </span>
  );
}
