import { useState } from 'react';

export default function FileDropzone({ label, accept, hint, onFile, previewUrl, busy }) {
  const [drag, setDrag] = useState(false);

  function pick(file) {
    if (file) onFile(file);
  }

  return (
    <label
      className={`block cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center transition ${
        drag ? 'border-sky bg-sky-50' : 'border-slate-300 bg-white'
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDrag(false);
        pick(event.dataTransfer.files?.[0]);
      }}
    >
      <p className="font-bold text-slate-700">{label}</p>
      <p className="mt-1 text-sm text-slate-500">{busy ? 'Uploading…' : hint}</p>
      {previewUrl ? (
        previewUrl.toLowerCase().includes('.pdf') ? (
          <p className="mt-3 truncate text-xs text-sky-700">{previewUrl}</p>
        ) : (
          <img src={previewUrl} alt="" className="mx-auto mt-3 h-24 rounded-xl object-cover" />
        )
      ) : null}
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => pick(event.target.files?.[0])}
      />
    </label>
  );
}
