import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { adminApi, getAdminToken, setAdminToken } from '../api/admin';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setReady(true);
      return;
    }
    adminApi
      .me()
      .then((data) => setUser(data))
      .catch(() => {
        setAdminToken('');
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      async login(username, password) {
        const result = await adminApi.login({ username, password });
        setAdminToken(result.token);
        setUser({ username: result.username, role: 'admin' });
      },
      logout() {
        setAdminToken('');
        setUser(null);
      }
    }),
    [user, ready]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
