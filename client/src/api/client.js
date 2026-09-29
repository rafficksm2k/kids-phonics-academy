const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const api = {
  listProducts: (params) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products?${query}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  createStripeCheckout: (body) =>
    request('/payments/stripe/create-checkout', { method: 'POST', body: JSON.stringify(body) }),
  confirmStripe: (sessionId) => request(`/payments/stripe/confirm?session_id=${sessionId}`),
  createRazorpayOrder: (body) =>
    request('/payments/razorpay/create-order', { method: 'POST', body: JSON.stringify(body) }),
  verifyRazorpay: (body) =>
    request('/payments/razorpay/verify', { method: 'POST', body: JSON.stringify(body) }),
  download: (token) => request(`/download/${token}`),
  contact: (body) => request('/contact', { method: 'POST', body: JSON.stringify(body) })
};
