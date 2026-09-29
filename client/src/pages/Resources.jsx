import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import PreviewModal from '../components/PreviewModal';
import CheckoutModal from '../components/CheckoutModal';

const PAGE_SIZE = 9;

export default function Resources() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ products: [], categories: [], pagination: { page: 1, totalPages: 1, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [buying, setBuying] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const result = await api.listProducts({
          page: String(page),
          limit: String(PAGE_SIZE),
          search,
          category
        });
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [page, search, category]);

  const categories = useMemo(() => ['All', ...(data.categories || [])], [data.categories]);

  async function openPreview(product) {
    setPreview(product);
    try {
      const fresh = await api.getProduct(product._id);
      setPreview(fresh);
    } catch {
      /* list data is enough for preview if the detail call fails */
    }
  }

  function openBuy(product) {
    setPreview(null);
    setBuying(product);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-[2rem] bg-sun p-6 shadow-lg sm:p-8">
        <h1 className="font-display text-4xl text-sky-900">Phonics resources</h1>
        <p className="mt-2 max-w-2xl font-semibold text-sky-950/80">
          Every pack is loaded from our API. Search, filter by category and page through 100+ PDFs as the library grows.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px]">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search title, code or description"
            className="rounded-2xl border-4 border-white px-4 py-3"
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="rounded-2xl border-4 border-white px-4 py-3 font-bold"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-6 font-bold text-sky-800">
        {loading ? 'Loading packs…' : `${data.pagination.total || 0} active packs`}
      </p>
      {error ? <p className="mt-3 rounded-2xl bg-red-100 p-4 font-bold text-red-700">{error}</p> : null}
      {!loading && !error ? (
        <>
          <ProductGrid products={data.products} onPreview={openPreview} onBuy={openBuy} />
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      ) : null}

      <PreviewModal product={preview} onClose={() => setPreview(null)} onBuy={openBuy} />
      <CheckoutModal product={buying} onClose={() => setBuying(null)} />
    </div>
  );
}
