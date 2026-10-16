const API_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'bma_admin_token';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setAdminToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function adminRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getAdminToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}/admin${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    setAdminToken('');
    const error = new Error(data.message || 'Admin session expired');
    error.status = 401;
    throw error;
  }
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const adminApi = {
  login: (body) =>
    adminRequest('/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => adminRequest('/me'),
  dashboard: () => adminRequest('/dashboard'),
  products: (params = {}) => adminRequest(`/products?${new URLSearchParams(params)}`),
  product: (id) => adminRequest(`/products/${id}`),
  createProduct: (body) =>
    adminRequest('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) =>
    adminRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => adminRequest(`/products/${id}`, { method: 'DELETE' }),
  orders: (params = {}) => adminRequest(`/orders?${new URLSearchParams(params)}`),
  analytics: () => adminRequest('/analytics'),
  messages: (params = {}) => adminRequest(`/messages?${new URLSearchParams(params)}`),
  settings: () => adminRequest('/settings'),
  saveSettings: (body) =>
    adminRequest('/settings', { method: 'PUT', body: JSON.stringify(body) }),
  upload: async (kind, file, extra = '') => {
    const form = new FormData();
    form.append('file', file);
    const path = kind === 'pdf' ? '/uploads/pdf' : kind === 'thumbnail' ? '/uploads/thumbnail' : `/uploads/image${extra}`;
    return adminRequest(path, { method: 'POST', body: form });
  }
};
