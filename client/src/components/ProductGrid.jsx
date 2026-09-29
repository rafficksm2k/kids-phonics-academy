import ProductCard from './ProductCard';

export default function ProductGrid({ products, onPreview, onBuy }) {
  if (!products.length) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow">
        <p className="font-display text-2xl text-sky-700">No phonics packs found</p>
        <p className="mt-2 text-slate-600">Try another category or search term.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onPreview={onPreview} onBuy={onBuy} />
      ))}
    </div>
  );
}
