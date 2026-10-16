import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import BrandMark from '../../components/BrandMark';
import { useAdminAuth } from '../../admin/AdminAuthContext';

export default function AdminLogin() {
  const { user, ready, login } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (ready && user) {
    return <Navigate to={location.state?.from || '/admin/dashboard'} replace />;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(username, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-900 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <BrandMark />
          <div>
            <p className="font-display text-2xl text-slate-800">Admin login</p>
            <p className="text-sm text-slate-500">Bright Minds Academy</p>
          </div>
        </div>
        <label className="block text-sm font-bold">
          Username
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="mt-4 block text-sm font-bold">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="mt-3 text-sm font-bold text-red-600">{error}</p> : null}
        <button
          disabled={busy}
          className="mt-6 w-full rounded-xl bg-slate-900 py-3 font-extrabold text-white"
          type="submit"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
