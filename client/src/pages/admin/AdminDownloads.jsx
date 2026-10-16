import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { adminApi } from '../../api/admin';

const COLORS = ['#66bb6a', '#4fc3f7', '#ff9800', '#7e57c2'];

export default function AdminDownloads() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.analytics().then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p>Loading downloads…</p>;

  const barData = data.downloads.byProduct.map((row) => ({
    name: row.title?.slice(0, 16) || row.productCode,
    downloads: row.downloads
  }));
  const pieData = data.downloads.byCategory.map((row) => ({
    name: row.category || 'unknown',
    value: row.total
  }));

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl">Downloads</h1>
      <article className="rounded-2xl bg-white p-5 shadow">
        <p className="text-sm font-semibold text-slate-500">Total Downloads</p>
        <p className="mt-2 text-3xl font-extrabold">{data.downloads.total}</p>
      </article>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 font-display text-xl">Downloads by Product</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="downloads" fill="#66bb6a" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 font-display text-xl">Downloads by Category</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <List title="Most Downloaded Products" rows={data.downloads.mostDownloaded} field="downloads" />
        <List title="Least Downloaded Products" rows={data.downloads.leastDownloaded} field="downloads" />
      </div>
      <section className="rounded-2xl bg-white p-5 shadow">
        <h2 className="mb-3 font-display text-xl">Recent Downloads</h2>
        <ul>
          {data.downloads.recent.map((item) => (
            <li key={item._id} className="flex justify-between border-b py-2 text-sm">
              <span>
                {item.productTitle || item.productCode}
                <span className="block text-slate-500">{item.customerEmail}</span>
              </span>
              <span>{new Date(item.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function List({ title, rows, field }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow">
      <h2 className="mb-3 font-display text-xl">{title}</h2>
      <ul>
        {rows.map((row) => (
          <li key={row._id} className="flex justify-between border-b py-2 text-sm">
            <span>{row.productId?.title || row.productId?.productCode}</span>
            <span className="font-bold">{row[field]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
