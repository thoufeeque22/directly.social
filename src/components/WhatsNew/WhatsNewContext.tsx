'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUnseenUpdates } from '@/app/actions/whats-new';

export interface Update {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface WhatsNewContextType {
  updates: Update[];
  setUpdates: React.Dispatch<React.SetStateAction<Update[]>>;
  refreshUpdates: () => Promise<Update[]>;
}

const WhatsNewContext = createContext<WhatsNewContextType | undefined>(undefined);

export function WhatsNewProvider({ children }: { children: React.ReactNode }) {
  const [updates, setUpdates] = useState<Update[]>([]);

  const refreshUpdates = async () => {
    const u = await getUnseenUpdates();
    setUpdates(u);
    return u;
  };

  useEffect(() => {
    const init = async () => {
      await refreshUpdates();
    };
    init();
  }, []);

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
