export default function PreviewModal({ product, onClose, onBuy }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl bg-white p-5 shadow-2xl">
        <img src={product.thumbnailUrl} alt="" className="h-64 w-full rounded-2xl object-cover" />
        <p className="mt-4 text-xs font-bold uppercase text-mango">{product.category}</p>
        <h3 className="font-display text-3xl text-sky-800">{product.title}</h3>
        <p className="mt-2 text-slate-600">{product.description}</p>
        <p className="mt-4 font-extrabold text-mango">
          €{Number(product.priceEUR).toFixed(2)} · ₹{Number(product.priceINR).toFixed(0)}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Full PDF files stay on Cloudinary and unlock only after a verified payment.
        </p>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={() => onBuy(product)} className="rounded-2xl bg-mango px-5 py-3 font-bold text-white">
            Buy Now
          </button>
          <button type="button" onClick={onClose} className="rounded-2xl bg-slate-100 px-5 py-3 font-bold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
