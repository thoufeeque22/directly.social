'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { LinkedInLockedCard } from './LinkedInLockedCard';
import { LinkedInIntegrationCard } from './LinkedInIntegrationCard';
import type { Account } from '@/lib/core/types';

interface LinkedInSectionProps {
  accounts: Account[];
  onDisconnect: (accountId: string) => void;
}

interface TierCheckResult {
  isPro: boolean;
}

/**
 * (OO-002): Orchestrator component for the LinkedIn integration section.
 * Fetches the user's billing tier and renders either:
 * - LinkedInLockedCard (Free tier — Pricing Anchor)
 * - LinkedInIntegrationCard (Pro+ — full OAuth + scheduling flow)
 */
export const LinkedInSection: React.FC<LinkedInSectionProps> = ({ accounts, onDisconnect }) => {
  const { data: session } = useSession();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    fetch('/api/linkedin/tier')
      .then((r) => r.json())
      .then((data: TierCheckResult) => {
        if (typeof data.isPro === 'boolean') setIsPro(data.isPro);
      })
      .catch(() => setIsPro(false));
  }, []);

  const linkedInAccount = accounts.find((a) => a.provider === 'linkedin');
  const userId = session?.user?.id ?? '';

  const handleUpgrade = () => {
    globalThis.location.href = '/settings?tab=account';
  };

  const handleDisconnect = () => {
    if (linkedInAccount) onDisconnect(linkedInAccount.id);
  };

  if (!isPro) {
    return <LinkedInLockedCard onUpgrade={handleUpgrade} />;
  }

  return (
    <LinkedInIntegrationCard
      userId={userId}
      isConnected={!!linkedInAccount}
      accountName={linkedInAccount?.accountName}
      onDisconnect={handleDisconnect}
    />
  );
};
