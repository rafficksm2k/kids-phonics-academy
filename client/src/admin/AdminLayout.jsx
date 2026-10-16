import { useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import AdminSidebar, { AdminMenuButton } from './AdminSidebar';

export default function AdminLayout() {
  const { user, ready, logout } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-slate-100 text-slate-600">Loading admin…</div>;
  }
  if (!user) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  function onLogout() {
    logout();
    navigate('/admin');
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      <AdminSidebar open={open} onClose={() => setOpen(false)} onLogout={onLogout} username={user.username} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-4 py-3 lg:px-8">
          <AdminMenuButton onClick={() => setOpen(true)} />
          <p className="font-display text-lg text-slate-700">Bright Minds Academy</p>
        </header>
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
