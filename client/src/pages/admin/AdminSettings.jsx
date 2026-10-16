import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import FileDropzone from '../../admin/FileDropzone';

export default function AdminSettings() {
  const [form, setForm] = useState({
    academyName: 'Bright Minds Academy',
    contactEmail: '',
    phoneNumber: '',
    facebookUrl: '',
    instagramUrl: '',
    logoUrl: '',
    heroBannerUrl: '',
    footerText: ''
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState('');

  useEffect(() => {
    adminApi.settings().then((data) => setForm((current) => ({ ...current, ...data }))).catch((err) => setError(err.message));
  }, []);

  async function upload(kind, file) {
    setUploading(kind);
    try {
      const result = await adminApi.upload('image', file, kind === 'logo' ? '?folder=logo' : '');
      setForm((current) => ({ ...current, [kind === 'logo' ? 'logoUrl' : 'heroBannerUrl']: result.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading('');
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    setStatus('');
    setError('');
    try {
      const saved = await adminApi.saveSettings(form);
      setForm((current) => ({ ...current, ...saved }));
      setStatus('Settings saved.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-4 rounded-2xl bg-white p-6 shadow">
      <h1 className="font-display text-3xl">Website Settings</h1>
      <Field label="Academy Name" value={form.academyName} onChange={(v) => setForm({ ...form, academyName: v })} />
      <Field label="Contact Email" value={form.contactEmail} onChange={(v) => setForm({ ...form, contactEmail: v })} />
      <Field label="Phone Number" value={form.phoneNumber} onChange={(v) => setForm({ ...form, phoneNumber: v })} />
      <Field label="Facebook URL" value={form.facebookUrl} onChange={(v) => setForm({ ...form, facebookUrl: v })} />
      <Field label="Instagram URL" value={form.instagramUrl} onChange={(v) => setForm({ ...form, instagramUrl: v })} />
      <FileDropzone label="Logo" accept="image/*" hint="Square logo works best" previewUrl={form.logoUrl} busy={uploading === 'logo'} onFile={(file) => upload('logo', file)} />
      <FileDropzone label="Hero Banner" accept="image/*" hint="Wide banner for the homepage" previewUrl={form.heroBannerUrl} busy={uploading === 'banner'} onFile={(file) => upload('banner', file)} />
      <label className="block text-sm font-bold">
        Footer Text
        <textarea className="mt-1 w-full rounded-xl border px-3 py-2" rows="3" value={form.footerText} onChange={(e) => setForm({ ...form, footerText: e.target.value })} />
      </label>
      {error ? <p className="font-bold text-red-600">{error}</p> : null}
      {status ? <p className="font-bold text-green-700">{status}</p> : null}
      <button className="rounded-xl bg-sky px-5 py-2 font-extrabold text-white" type="submit">Save settings</button>
    </form>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input className="mt-1 w-full rounded-xl border px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
