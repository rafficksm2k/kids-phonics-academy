export default function ProductCard({ product, onPreview, onBuy }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border-4 border-white bg-white shadow-lg shadow-sky-100 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 overflow-hidden bg-sun">
        <img
          src={product.thumbnailUrl}
          alt={product.title}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-leaf px-3 py-1 text-xs font-extrabold text-white">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-mango">{product.productCode}</p>
        <h3 className="font-display text-xl text-sky-800">{product.title}</h3>
        <p className="line-clamp-3 flex-1 text-sm text-slate-600">{product.description}</p>
        <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-3 py-2 text-sm font-extrabold">
          <span className="text-mango">€{Number(product.priceEUR).toFixed(2)}</span>
          <span className="text-leaf">₹{Number(product.priceINR).toFixed(0)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onPreview(product)}
            className="rounded-2xl bg-sky px-3 py-2 font-bold text-white"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => onBuy(product)}
            className="rounded-2xl bg-mango px-3 py-2 font-bold text-white"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
