'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LinkedInIntegrationCard } from './LinkedInIntegrationCard';
import type { Account } from '@/lib/core/types';

interface LinkedInSectionProps {
  accounts: Account[];
  onDisconnect: (accountId: string) => void;
}

interface LinkedInStatus {
  connected: boolean;
  accountName: string | null;
}

/**
 * (OO-002): Orchestrator component for the LinkedIn integration section.
 * Fetches connection status directly from /api/linkedin/status to avoid
 * depending on the shared useAccounts state (which can be stale).
 */
export const LinkedInSection: React.FC<LinkedInSectionProps> = ({ accounts, onDisconnect }) => {
  const [status, setStatus] = useState<LinkedInStatus>({ connected: false, accountName: null });

  useEffect(() => {
    let mounted = true;
    const fetchIt = async () => {
      try {
        const res = await fetch('/api/linkedin/status');
        if (res.ok) {
          const data = (await res.json()) as LinkedInStatus;
          if (mounted) setStatus(data);
        }
      } catch {
        // silently ignore
      }
    };

    fetchIt().catch(() => {});

    const params = new URLSearchParams(globalThis.location?.search ?? '');
    if (params.get('linkedin_connected') === 'true') {
      fetchIt().catch(() => {});
    }

    const handleRefresh = () => { fetchIt().catch(() => {}); };
    globalThis.addEventListener('app:refresh', handleRefresh);
    
    return () => {
      mounted = false;
      globalThis.removeEventListener('app:refresh', handleRefresh);
    };
  }, []);

  const linkedInAccount = accounts.find((a) => a.provider === 'linkedin');

  const handleDisconnect = () => {
    if (linkedInAccount) {
      onDisconnect(linkedInAccount.id);
      setStatus({ connected: false, accountName: null });
    }
  };

  return (
    <LinkedInIntegrationCard
      isConnected={status.connected}
      accountName={status.accountName}
      onDisconnect={handleDisconnect}
    />
  );
};
