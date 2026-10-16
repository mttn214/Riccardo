import React, { useEffect } from 'react';
import { useAdminStore } from '../hooks/useAdminStore';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminLayout } from '../components/admin/AdminLayout';

export const AdminPage: React.FC = () => {
  const { isAuthenticated, store } = useAdminStore();

  useEffect(() => {
    document.title = 'Administrácia | Hair Salon Riccardo & ZETEREM s.r.o.';
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => {}} />;
  }

  return <AdminLayout />;
};

export default AdminPage;
