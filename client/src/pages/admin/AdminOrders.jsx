import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';

export default function AdminOrders() {
  const [data, setData] = useState({ orders: [], pagination: { page: 1, totalPages: 1 } });
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ from: '', to: '', category: '', product: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const params = { page: String(page), limit: '20' };
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    if (filters.category) params.category = filters.category;
    if (filters.product) params.product = filters.product;
    adminApi.orders(params).then(setData).catch((err) => setError(err.message));
  }, [page, filters]);

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl">Orders</h1>
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <input type="date" className="rounded-xl border px-3 py-2" value={filters.from} onChange={(e) => { setPage(1); setFilters({ ...filters, from: e.target.value }); }} />
        <input type="date" className="rounded-xl border px-3 py-2" value={filters.to} onChange={(e) => { setPage(1); setFilters({ ...filters, to: e.target.value }); }} />
        <select className="rounded-xl border px-3 py-2" value={filters.category} onChange={(e) => { setPage(1); setFilters({ ...filters, category: e.target.value }); }}>
          <option value="">All categories</option>
          <option value="brain-exercise">Brain Exercise</option>
          <option value="phonics">Phonics</option>
        </select>
        <input className="rounded-xl border px-3 py-2" placeholder="Product, email or order ID" value={filters.product} onChange={(e) => { setPage(1); setFilters({ ...filters, product: e.target.value }); }} />
      </div>
      {error ? <p className="text-red-600">{error}</p> : null}
      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Product</th>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Customer Email</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Currency</th>
              <th className="p-3">Payment Status</th>
              <th className="p-3">Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {data.orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="p-3 font-mono text-xs">{order.orderId}</td>
                <td className="p-3">{order.productId?.title || order.productCode}</td>
                <td className="p-3">{order.customerName}</td>
                <td className="p-3">{order.customerEmail}</td>
                <td className="p-3">{order.amount}</td>
                <td className="p-3">{order.currency}</td>
                <td className="p-3">{order.paymentStatus}</td>
                <td className="p-3">{new Date(order.createdAt).toLocaleString()}</td>
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
