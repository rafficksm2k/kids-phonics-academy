import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import FileDropzone from '../../admin/FileDropzone';

const EMPTY = {
  productCode: '',
  title: '',
  description: '',
  longDescription: '',
  category: 'brain-exercise',
  subCategory: 'age4to6',
  priceINR: 0,
  priceEUR: 0,
  thumbnailUrl: '',
  pdfUrl: '',
  featured: false,
  active: true
};

const SUBS = {
  'brain-exercise': [
    { value: 'age4to6', label: 'Age 4-6' },
    { value: 'age6to8', label: 'Age 6-8' },
    { value: 'age8plus', label: 'Age 8+' }
  ],
  phonics: [
    { value: 'basic', label: 'Basic' },
    { value: 'advanced', label: 'Advanced' }
  ]
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState('');

  const subOptions = useMemo(() => SUBS[form.category] || [], [form.category]);

  useEffect(() => {
    if (!id) return;
    adminApi.product(id).then((product) => setForm({ ...EMPTY, ...product })).catch((err) => setError(err.message));
  }, [id]);

  function setField(key, value) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === 'category') {
        next.subCategory = SUBS[value][0].value;
      }
      return next;
    });
  }

  async function upload(kind, file) {
    setUploading(kind);
    try {
      const result = await adminApi.upload(kind, file);
      setField(kind === 'pdf' ? 'pdfUrl' : 'thumbnailUrl', result.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading('');
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = {
        ...form,
        priceEUR: Number(form.priceEUR),
        priceINR: Number(form.priceINR)
      };
      if (id) await adminApi.updateProduct(id, payload);
      else await adminApi.createProduct(payload);
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-4 rounded-2xl bg-white p-6 shadow">
      <h1 className="font-display text-3xl">{id ? 'Edit Product' : 'Add Product'}</h1>
      <Field label="Product Code" value={form.productCode} onChange={(v) => setField('productCode', v)} required />
      <Field label="Title" value={form.title} onChange={(v) => setField('title', v)} required />
      <label className="block text-sm font-bold">
        Short Description
        <textarea className="mt-1 w-full rounded-xl border px-3 py-2" rows="3" value={form.description} onChange={(e) => setField('description', e.target.value)} required />
      </label>
      <label className="block text-sm font-bold">
        Long Description
        <textarea className="mt-1 w-full rounded-xl border px-3 py-2" rows="5" value={form.longDescription} onChange={(e) => setField('longDescription', e.target.value)} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold">
          Category
          <select className="mt-1 w-full rounded-xl border px-3 py-2" value={form.category} onChange={(e) => setField('category', e.target.value)}>
            <option value="brain-exercise">Brain Exercise Resources</option>
            <option value="phonics">Phonics Resources</option>
          </select>
        </label>
        <label className="block text-sm font-bold">
          Subcategory
          <select className="mt-1 w-full rounded-xl border px-3 py-2" value={form.subCategory} onChange={(e) => setField('subCategory', e.target.value)}>
            {subOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <Field label="Price INR" type="number" value={form.priceINR} onChange={(v) => setField('priceINR', v)} />
        <Field label="Price EUR" type="number" value={form.priceEUR} onChange={(v) => setField('priceEUR', v)} />
      </div>
      <FileDropzone
        label="Thumbnail Upload"
        accept="image/*"
        hint="Drag and drop an image, or click to browse"
        previewUrl={form.thumbnailUrl}
        busy={uploading === 'thumbnail'}
        onFile={(file) => upload('thumbnail', file)}
      />
      <FileDropzone
        label="PDF Upload"
        accept="application/pdf"
        hint="Drag and drop a PDF, or click to browse"
        previewUrl={form.pdfUrl}
        busy={uploading === 'pdf'}
        onFile={(file) => upload('pdf', file)}
      />
      <label className="flex items-center gap-2 font-bold">
        <input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => setField('featured', e.target.checked)} />
        Featured Product
      </label>
      <label className="flex items-center gap-2 font-bold">
        <input type="checkbox" checked={Boolean(form.active)} onChange={(e) => setField('active', e.target.checked)} />
        Active
      </label>
      {error ? <p className="font-bold text-red-600">{error}</p> : null}
      <div className="flex gap-3">
        <button disabled={busy} className="rounded-xl bg-sky px-5 py-2 font-extrabold text-white" type="submit">
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="rounded-xl bg-slate-100 px-5 py-2 font-bold" onClick={() => navigate('/admin/products')}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input className="mt-1 w-full rounded-xl border px-3 py-2" type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
