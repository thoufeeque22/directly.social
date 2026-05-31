'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getUnseenUpdates } from '@/app/actions/whats-new';
import { Update, WhatsNewContextType } from './types';

const WhatsNewContext = createContext<WhatsNewContextType | undefined>(undefined);

export function WhatsNewProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [updates, setUpdates] = useState<Update[]>([]);
  const refreshUpdates = useCallback(async () => {
    if (status !== 'authenticated') return [];
    try {
      const u = await getUnseenUpdates();
      setUpdates(u);
      return u;
    } catch (error) {
      console.error('[WhatsNew] Failed to fetch updates:', error);
      return [];
    }
  }, [status]);
  useEffect(() => {
    if (status === 'authenticated') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshUpdates();
    }
  }, [status, refreshUpdates]);
  useEffect(() => {
    const handleRefresh = () => refreshUpdates();
    globalThis.addEventListener('app:refresh', handleRefresh);
    return () => globalThis.removeEventListener('app:refresh', handleRefresh);
  }, [refreshUpdates]);
  return (
    <WhatsNewContext.Provider value={{ updates, setUpdates, refreshUpdates }}>
      {children}
    </WhatsNewContext.Provider>
  );
}
export function useWhatsNew() {
  const context = useContext(WhatsNewContext);
  if (context === undefined) {
    throw new Error('useWhatsNew must be used within a WhatsNewProvider');
  }
  return context;
}
