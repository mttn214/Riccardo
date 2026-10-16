import { useState, useEffect } from 'react';
import { adminStore } from '../services/adminStore';

export function useAdminStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
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
