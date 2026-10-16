import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { adminApi } from '../../api/admin';

const COLORS = ['#4fc3f7', '#ff9800', '#66bb6a', '#ffd54a', '#7e57c2'];

function money(block = {}) {
  return `€${Number(block.EUR || 0).toFixed(2)} · ₹${Number(block.INR || 0).toFixed(0)}`;
}

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.analytics().then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p>Loading analytics…</p>;

  const pieData = data.revenue.byCategory.map((row) => ({
    name: row.category || 'unknown',
    value: Number(row.INR || 0) + Number(row.EUR || 0)
  }));
  const barData = data.revenue.topSelling.map((row) => ({
    name: row.title?.slice(0, 18) || 'Product',
    sales: row.count
  }));

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card label="Today's Revenue" value={money(data.revenue.today)} />
        <Card label="Monthly Revenue" value={money(data.revenue.monthly)} />
        <Card label="Yearly Revenue" value={money(data.revenue.yearly)} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 font-display text-xl">Top Selling Products</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="sales" fill="#4fc3f7" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 font-display text-xl">Revenue by Category</h2>
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
      <section className="rounded-2xl bg-white p-5 shadow">
        <h2 className="mb-3 font-display text-xl">Revenue by Product</h2>
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="py-2">Product</th>
              <th>EUR</th>
              <th>INR</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {data.revenue.byProduct.map((row) => (
              <tr key={row.productId} className="border-t">
                <td className="py-2">{row.title}</td>
                <td>€{Number(row.EUR).toFixed(2)}</td>
                <td>₹{Number(row.INR).toFixed(0)}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
    </article>
  );
}
