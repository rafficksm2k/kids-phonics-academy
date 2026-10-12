import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import PreviewModal from '../components/PreviewModal';
import CheckoutModal from '../components/CheckoutModal';
import ResourceHubCard from '../components/ResourceHubCard';

const PAGE_SIZE = 9;

const HUBS = [
  {
    id: 'brain-exercise',
    title: 'Brain Exercise Resources',
    description: 'Improve concentration, memory and thinking skills.',
    image: 'https://res.cloudinary.com/t1tk69nn/image/upload/v1791121722/activity.jpg',
    imageAlt: 'Children doing colourful brain gym and cognitive play',
    buttons: [
      { key: 'brain-exercise:age4to6', label: 'Age 4-6', category: 'brain-exercise', subCategory: 'age4to6', idleClass: 'bg-leaf/40', activeClass: 'bg-leaf' },
      { key: 'brain-exercise:age6to8', label: 'Age 6-8', category: 'brain-exercise', subCategory: 'age6to8', idleClass: 'bg-sun', activeClass: 'bg-mango' },
      { key: 'brain-exercise:age8plus', label: 'Age 8+', category: 'brain-exercise', subCategory: 'age8plus', idleClass: 'bg-sky/40', activeClass: 'bg-sky' }
    ]
  },
  {
    id: 'phonics',
    title: 'Phonics Resources',
    description: 'Build strong reading, blending and phonics skills.',
    image: 'https://res.cloudinary.com/t1tk69nn/image/upload/v1791121725/resources.jpg',
    imageAlt: 'Colourful classroom with children learning letters',
    buttons: [
      { key: 'phonics:basic', label: 'Basic', category: 'phonics', subCategory: 'basic', idleClass: 'bg-sun', activeClass: 'bg-mango' },
      { key: 'phonics:advanced', label: 'Advanced', category: 'phonics', subCategory: 'advanced', idleClass: 'bg-sky/40', activeClass: 'bg-sky' }
    ]
  }
];

const FILTER_LABELS = {
  'phonics:basic': 'Phonics · Basic',
  'phonics:advanced': 'Phonics · Advanced',
  'brain-exercise:age4to6': 'Brain Exercise · Age 4-6',
  'brain-exercise:age6to8': 'Brain Exercise · Age 6-8',
  'brain-exercise:age8plus': 'Brain Exercise · Age 8+'
};

export default function Resources() {
  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ products: [], pagination: { page: 1, totalPages: 1, total: 0 } });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [buying, setBuying] = useState(null);

  useEffect(() => {
    if (!filter) {
      setData({ products: [], pagination: { page: 1, totalPages: 1, total: 0 } });
      setLoading(false);
      setError('');
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const result = await api.listProducts({
          page: String(page),
          limit: String(PAGE_SIZE),
          category: filter.category,
          subCategory: filter.subCategory
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
  }, [page, filter]);

  function selectFilter(button) {
    setPage(1);
    setFilter(button);
    window.requestAnimationFrame(() => {
      document.getElementById('resource-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

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
      <div className="mb-8 text-center">
        <p className="inline-block rounded-full bg-sun px-4 py-1 text-sm font-extrabold text-sky-900">Brain gym & learning store</p>
        <h1 className="mt-3 font-display text-4xl text-sky-900 sm:text-5xl">Resources</h1>
        <p className="mx-auto mt-3 max-w-2xl font-semibold text-slate-600">
          Start with brain exercise packs for memory, focus and thinking — phonics collections are here too when you
          need them.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {HUBS.map((hub) => (
          <ResourceHubCard
            key={hub.id}
            {...hub}
            activeKey={filter?.key}
            onSelect={selectFilter}
          />
        ))}
      </div>

      <div id="resource-results" className="mt-10 scroll-mt-24">
        {!filter ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow">
            <p className="font-display text-2xl text-sky-800">Pick a button above</p>
            <p className="mt-2 text-slate-600">Products appear here after you choose an age group, Basic, or Advanced.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 font-bold text-sky-800">
              {loading ? 'Loading packs…' : `${FILTER_LABELS[filter.key]} · ${data.pagination.total || 0} packs`}
            </p>
            {error ? <p className="mb-4 rounded-2xl bg-red-100 p-4 font-bold text-red-700">{error}</p> : null}
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
          </>
        )}
      </div>

      <PreviewModal product={preview} onClose={() => setPreview(null)} onBuy={openBuy} />
      <CheckoutModal product={buying} onClose={() => setBuying(null)} />
    </div>
  );
}
