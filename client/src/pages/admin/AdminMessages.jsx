import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';

export default function AdminMessages() {
  const [data, setData] = useState({ messages: [], pagination: { page: 1, totalPages: 1 } });
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.messages({ page: String(page), limit: '20' }).then(setData).catch((err) => setError(err.message));
  }, [page]);

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl">Messages</h1>
      {error ? <p className="text-red-600">{error}</p> : null}
      <div className="space-y-4">
        {data.messages.map((message) => (
          <article key={message._id} className="rounded-2xl bg-white p-5 shadow">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-bold">{message.name} · {message.email}</p>
              <p className="text-sm text-slate-500">{new Date(message.createdAt).toLocaleString()}</p>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-slate-700">{message.message}</p>
          </article>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg bg-white px-3 py-1 shadow disabled:opacity-40">Prev</button>
        <span className="py-1 text-sm">{data.pagination.page} / {data.pagination.totalPages}</span>
        <button disabled={page >= data.pagination.totalPages} onClick={() => setPage(page + 1)} className="rounded-lg bg-white px-3 py-1 shadow disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
