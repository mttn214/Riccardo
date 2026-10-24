import { useState, useEffect } from 'react';
import { adminStore } from '../services/adminStore';

export function useAdminStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Automatically synchronize live participants and bookings from Supabase Cloud
    adminStore.syncWithCloud().catch(() => {});

    const unsubscribe = adminStore.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  return {
    isAuthenticated: adminStore.isAuthenticated(),
    seminars: adminStore.getSeminars(),
    participants: adminStore.getParticipants(),
    portfolio: adminStore.getPortfolio(),
    inquiries: adminStore.getInquiries(),
    auditLogs: adminStore.getAuditLogs(),
    settings: adminStore.getSettings(),
    store: adminStore,
  };
}
