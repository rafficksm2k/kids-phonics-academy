import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';

function money(revenue = {}) {
  return `€${Number(revenue.EUR || 0).toFixed(2)} · ₹${Number(revenue.INR || 0).toFixed(0)}`;
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.dashboard().then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p>Loading dashboard…</p>;

  const cards = [
    { label: 'Total Products', value: data.cards.totalProducts },
    { label: 'Total Orders', value: data.cards.totalOrders },
    { label: 'Total Revenue', value: money(data.cards.totalRevenue) },
    { label: 'Total Downloads', value: data.cards.totalDownloads },
    { label: 'Total Contact Messages', value: data.cards.totalMessages }
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm font-semibold text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-800">{card.value}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recent Orders">
          {data.recentOrders.map((order) => (
            <li key={order.orderId} className="flex justify-between gap-3 border-b py-2 text-sm">
              <span>
                {order.orderId}
                <span className="block text-slate-500">{order.productId?.title || order.productCode}</span>
              </span>
              <span className="font-bold">
                {order.currency} {order.amount}
              </span>
            </li>
          ))}
        </Panel>
        <Panel title="Recent Downloads">
          {data.recentDownloads.map((item) => (
            <li key={item._id} className="flex justify-between gap-3 border-b py-2 text-sm">
              <span>
                {item.productTitle || item.productCode}
                <span className="block text-slate-500">{item.customerEmail}</span>
              </span>
              <span>{new Date(item.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </Panel>
        <Panel title="Most Downloaded Products">
          {data.mostDownloaded.map((row) => (
            <li key={row._id} className="flex justify-between border-b py-2 text-sm">
              <span>{row.productId?.title}</span>
              <span className="font-bold">{row.downloads}</span>
            </li>
          ))}
        </Panel>
        <Panel title="Most Viewed Products">
          {data.mostViewed.map((row) => (
            <li key={row._id} className="flex justify-between border-b py-2 text-sm">
              <span>{row.productId?.title}</span>
              <span className="font-bold">{row.views}</span>
            </li>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow">
      <h2 className="mb-3 font-display text-xl">{title}</h2>
      <ul>{children}</ul>
    </section>
  );
}
