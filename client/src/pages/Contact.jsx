import { useState } from 'react';
import { api } from '../api/client';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const email = import.meta.env.VITE_CONTACT_EMAIL || 'your-email@example.com';
const phone = import.meta.env.VITE_CONTACT_PHONE || '+49 xxxx xxxx';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email)) next.email = 'Enter a valid email format';
    if (!form.message.trim()) next.message = 'Message is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setBusy(true);
    setStatus('');
    try {
      const result = await api.contact(form);
      setStatus(result.message);
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  function onCancel() {
    setForm({ name: '', email: '', message: '' });
    setErrors({});
    setStatus('');
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2">
      <section>
        <h1 className="font-display text-4xl text-sky-800">Contact us</h1>
        <p className="mt-3 text-slate-700">We love helping families and classrooms find the right phonics pack.</p>
        <div className="mt-6 space-y-3 rounded-3xl bg-white p-6 shadow-lg">
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Phone:</strong> {phone}
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1588072432836-e10032774343?auto=format&fit=crop&w=1000&q=80"
          alt="Children learning together in a colourful classroom"
          className="mt-6 h-72 w-full rounded-3xl object-cover shadow-xl"
        />
      </section>

      <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6 shadow-xl">
        <label className="block font-bold">
          Name
          <input
            className="mt-1 w-full rounded-2xl border-2 border-sky-100 px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        {errors.name ? <p className="text-sm font-bold text-red-600">{errors.name}</p> : null}
        <label className="mt-4 block font-bold">
          Email
          <input
            type="email"
            className="mt-1 w-full rounded-2xl border-2 border-sky-100 px-3 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        {errors.email ? <p className="text-sm font-bold text-red-600">{errors.email}</p> : null}
        <label className="mt-4 block font-bold">
          Message
          <textarea
            rows="6"
            className="mt-1 w-full rounded-2xl border-2 border-sky-100 px-3 py-2"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </label>
        {errors.message ? <p className="text-sm font-bold text-red-600">{errors.message}</p> : null}
        {status ? <p className="mt-3 rounded-2xl bg-leaf/20 p-3 font-bold text-leaf">{status}</p> : null}
        <div className="mt-5 flex gap-3">
          <button disabled={busy} className="rounded-2xl bg-mango px-5 py-3 font-extrabold text-white" type="submit">
            Submit
          </button>
          <button type="button" onClick={onCancel} className="rounded-2xl bg-slate-100 px-5 py-3 font-extrabold">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
