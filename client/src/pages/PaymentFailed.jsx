import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentFailed() {
  const [params] = useSearchParams();
  const reason = params.get('reason');

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="font-display text-4xl text-mango">Payment not completed</h1>
        <p className="mt-4 text-slate-700">
          {reason === 'cancelled' ? 'Checkout was cancelled.' : 'We could not verify that payment.'}
        </p>
        <Link to="/resources" className="mt-6 inline-block rounded-full bg-sky px-6 py-3 font-extrabold text-white">
          Try again
        </Link>
      </div>
    </div>
  );
}
