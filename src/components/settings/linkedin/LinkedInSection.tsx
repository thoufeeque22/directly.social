'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { LinkedInIntegrationCard } from './LinkedInIntegrationCard';
import type { Account } from '@/lib/core/types';

interface LinkedInSectionProps {
  accounts: Account[];
  onDisconnect: (accountId: string) => void;
}

/**
 * (OO-002): Orchestrator component for the LinkedIn integration section.
 * Available to all subscription tiers — connects and schedules posts directly.
 */
export const LinkedInSection: React.FC<LinkedInSectionProps> = ({ accounts, onDisconnect }) => {
  const { data: session } = useSession();

  const linkedInAccount = accounts.find((a) => a.provider === 'linkedin');
  const userId = session?.user?.id ?? '';

  const handleDisconnect = () => {
    if (linkedInAccount) onDisconnect(linkedInAccount.id);
  };

  return (
    <LinkedInIntegrationCard
      userId={userId}
      isConnected={!!linkedInAccount}
      accountName={linkedInAccount?.accountName}
      onDisconnect={handleDisconnect}
    />
  );
};
