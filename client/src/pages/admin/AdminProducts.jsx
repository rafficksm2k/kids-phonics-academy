import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin';

const LABELS = {
  phonics: 'Phonics',
  'brain-exercise': 'Brain Exercise',
  basic: 'Basic',
  advanced: 'Advanced',
  age4to6: 'Age 4-6',
  age6to8: 'Age 6-8',
  age8plus: 'Age 8+'
};

export default function AdminProducts() {
  const [data, setData] = useState({ products: [], pagination: { page: 1, totalPages: 1, total: 0 } });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  async function load(nextPage = page) {
    const result = await adminApi.products({ page: String(nextPage), limit: '20', search, status });
    setData(result);
  }

  useEffect(() => {
    load(page).catch((err) => setError(err.message));
  }, [page, status]);

  async function toggleActive(product) {
    await adminApi.updateProduct(product._id, { active: !product.active });
    await load();
  }

  async function remove(product) {
    if (!window.confirm(`Delete or deactivate ${product.title}?`)) return;
    await adminApi.deleteProduct(product._id);
    await load();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Products</h1>
        <Link to="/admin/products/new" className="rounded-xl bg-sky px-4 py-2 font-bold text-white">
          Add Product
        </Link>
      </div>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setPage(1);
              load(1);
            }
          }}
          placeholder="Search code or title"
          className="rounded-xl border px-3 py-2"
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-xl border px-3 py-2">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="button" className="rounded-xl bg-slate-800 px-4 py-2 font-bold text-white" onClick={() => { setPage(1); load(1); }}>
          Search
        </button>
      </div>
      {error ? <p className="text-red-600">{error}</p> : null}
      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="p-3">Thumbnail</th>
              <th className="p-3">Product Code</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Subcategory</th>
              <th className="p-3">Price</th>
              <th className="p-3">Downloads</th>
              <th className="p-3">Views</th>
              <th className="p-3">Revenue</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="p-3">
                  {product.thumbnailUrl ? (
                    <img src={product.thumbnailUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  ) : (
                    '—'
                  )}
                </td>
                <td className="p-3 font-mono text-xs">{product.productCode}</td>
                <td className="p-3 font-bold">{product.title}</td>
                <td className="p-3">{LABELS[product.category] || product.category}</td>
                <td className="p-3">{LABELS[product.subCategory] || product.subCategory}</td>
                <td className="p-3">€{product.priceEUR} / ₹{product.priceINR}</td>
                <td className="p-3">{product.downloads}</td>
                <td className="p-3">{product.views}</td>
                <td className="p-3">€{product.revenue?.EUR || 0} / ₹{product.revenue?.INR || 0}</td>
                <td className="p-3">
                  <button type="button" onClick={() => toggleActive(product)} className={`rounded-full px-2 py-1 text-xs font-bold ${product.active ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link to={`/admin/products/${product._id}`} className="font-bold text-sky-700">Edit</Link>
                    <button type="button" onClick={() => remove(product)} className="font-bold text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex gap-2">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg bg-white px-3 py-1 shadow disabled:opacity-40">Prev</button>
        <span className="py-1 text-sm">{data.pagination.page} / {data.pagination.totalPages}</span>
        <button disabled={page >= data.pagination.totalPages} onClick={() => setPage(page + 1)} className="rounded-lg bg-white px-3 py-1 shadow disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
