export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-full bg-white px-4 py-2 font-bold text-sky-700 shadow disabled:opacity-40"
      >
        Prev
      </button>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPageChange(item)}
          className={`h-10 w-10 rounded-full font-extrabold ${
            item === page ? 'bg-mango text-white' : 'bg-white text-sky-700 shadow'
          }`}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-full bg-white px-4 py-2 font-bold text-sky-700 shadow disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
