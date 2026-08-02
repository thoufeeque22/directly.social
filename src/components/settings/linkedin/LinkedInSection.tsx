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

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/linkedin/status');
      if (res.ok) {
        const data = (await res.json()) as LinkedInStatus;
        setStatus(data);
      }
    } catch {
      // silently ignore — default to not connected
    }
  }, []);

  useEffect(() => {
    void fetchStatus();

    // Re-check if the page URL has linkedin_connected=true after OAuth redirect
    const params = new URLSearchParams(globalThis.location?.search ?? '');
    if (params.get('linkedin_connected') === 'true') {
      void fetchStatus();
    }

    const handleRefresh = () => void fetchStatus();
    globalThis.addEventListener('app:refresh', handleRefresh);
    return () => globalThis.removeEventListener('app:refresh', handleRefresh);
  }, [fetchStatus]);

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
