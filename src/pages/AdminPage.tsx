import React, { useEffect } from 'react';
import { useAdminStore } from '../hooks/useAdminStore';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminThemeProvider, useAdminTheme } from '../context/AdminThemeContext';

const AdminContent: React.FC = () => {
  const { isAuthenticated } = useAdminStore();
  const { theme } = useAdminTheme();

  useEffect(() => {
    document.title = 'Administrácia | Hair Salon Riccardo & ZETEREM s.r.o.';
    if (theme === 'light') {
      document.body.classList.add('admin-light-mode');
    } else {
      document.body.classList.remove('admin-light-mode');
    }
    return () => {
      document.body.classList.remove('admin-light-mode');
    };
  }, [theme]);

  return (
    <div className="admin-portal">
      {isAuthenticated ? <AdminLayout /> : <AdminLogin onLoginSuccess={() => {}} />}
    </div>
  );
};

export const AdminPage: React.FC = () => {
  return (
    <AdminThemeProvider>
      <AdminContent />
    </AdminThemeProvider>
  );
};

export default AdminPage;
