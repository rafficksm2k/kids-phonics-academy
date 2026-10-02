import { useState } from 'react';
import { api } from '../api/client';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CheckoutModal({ product, onClose }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!product) return null;

  function validate() {
    if (!customerName.trim() || !customerEmail.trim()) {
      setError('Name and email are required.');
      return false;
    }
    if (!EMAIL_REGEX.test(customerEmail)) {
      setError('Please enter a valid email.');
      return false;
    }
    setError('');
    return true;
  }

  async function payStripe() {
    if (!validate()) return;
    setBusy(true);
    try {
      const { checkoutUrl } = await api.createStripeCheckout({
        productId: product._id,
        customerName,
        customerEmail
      });
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function payRazorpay() {
    if (!validate()) return;
    setBusy(true);
    try {
      const order = await api.createRazorpayOrder({
        productId: product._id,
        customerName,
        customerEmail
      });

      const checkoutKey = order.keyId;
      if (!checkoutKey) {
        setError('Razorpay key is missing from the server response.');
        setBusy(false);
        return;
      }

      const envKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (envKey && envKey !== checkoutKey && envKey !== 'rzp_test_xxx') {
        console.warn('VITE_RAZORPAY_KEY_ID does not match the server key. Using the server keyId.');
      }

      const options = {
        key: checkoutKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Kids Phonics Academy',
        description: order.productTitle,
        order_id: order.razorpayOrderId,
        prefill: { name: customerName, email: customerEmail },
        handler: async (response) => {
          try {
            const result = await api.verifyRazorpay({
              orderId: order.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            window.location.href = `/payment/success?token=${result.token}&orderId=${result.orderId}`;
          } catch (err) {
            const params = new URLSearchParams({
              reason: 'verify',
              description: err.message || 'Verification failed'
            });
            window.location.href = `/payment/failed?${params.toString()}`;
          }
        }
      };

      const checkout = new window.Razorpay(options);
      checkout.on('payment.failed', (response) => {
        const error = response?.error || {};
        console.error('[Razorpay payment.failed]', error);
        const params = new URLSearchParams({
          reason: 'razorpay',
          code: error.code || '',
          description: error.description || 'Razorpay checkout failed',
          source: error.source || '',
          step: error.step || '',
          httpStatus: String(error.status || '')
        });
        window.location.href = `/payment/failed?${params.toString()}`;
      });
      checkout.open();
      setBusy(false);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="font-display text-2xl text-sky-800">Buy {product.title}</h3>
        <p className="mt-1 text-sm text-slate-600">No account needed. Pay in EUR (Stripe) or INR (Razorpay).</p>
        <label className="mt-4 block text-sm font-bold">
          Name
          <input
            className="mt-1 w-full rounded-2xl border-2 border-sky-100 px-3 py-2"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </label>
        <label className="mt-3 block text-sm font-bold">
          Email
          <input
            type="email"
            className="mt-1 w-full rounded-2xl border-2 border-sky-100 px-3 py-2"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </label>
        {error ? <p className="mt-3 text-sm font-bold text-red-600">{error}</p> : null}
        <div className="mt-5 grid gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={payStripe}
            className="rounded-2xl bg-sky py-3 font-extrabold text-white"
          >
            Pay €{Number(product.priceEUR).toFixed(2)} with Stripe
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={payRazorpay}
            className="rounded-2xl bg-leaf py-3 font-extrabold text-white"
          >
            Pay ₹{Number(product.priceINR).toFixed(0)} with Razorpay
          </button>
          <button type="button" onClick={onClose} className="rounded-2xl bg-slate-100 py-3 font-bold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
