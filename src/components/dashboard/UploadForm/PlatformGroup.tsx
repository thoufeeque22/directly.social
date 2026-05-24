import React from 'react';
import Link from 'next/link';
import { Account, PlatformPreference } from '@/lib/core/types';
import { AccountToggle } from './AccountToggle';
import { getDistributionChannels } from '@/lib/core/utils/distribution-channels';

interface PlatformGroupProps {
  accounts: Account[];
  preferences: PlatformPreference[];
  selectedAccountIds: string[];
  successfulAccountIds?: string[];
  platformStatuses?: Record<string, 'pending' | 'uploading' | 'processing' | 'success' | 'failed' | 'cancelled'>;
  platformErrors?: Record<string, string>;
  onToggleAccount: (id: string) => void;
}

export const PlatformGroup: React.FC<PlatformGroupProps> = ({
  accounts, preferences, selectedAccountIds, successfulAccountIds = [],
  platformStatuses = {}, platformErrors = {}, onToggleAccount,
}) => {
  const channels = getDistributionChannels(accounts, preferences);

  return (
    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
      {channels.length > 0 ? (
        channels.map((channel) => (
          <AccountToggle
            key={channel.id}
            id={channel.id}
            platform={channel.platform}
            displayName={channel.displayName}
            isSelected={selectedAccountIds.includes(channel.id)}
            status={successfulAccountIds.includes(channel.id) ? 'success' : platformStatuses[channel.id]}
            error={platformErrors[channel.id]}
            onToggle={onToggleAccount}
          />
        ))
      ) : (
        <p style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', fontStyle: 'italic', margin: 0 }}>
          No active platforms found.
        </p>
      )}
      <ManageChannelsLink hasAccounts={accounts.length > 0} />
    </div>
  );
};

const ManageChannelsLink = ({ hasAccounts }: { hasAccounts: boolean }) => (
  <Link
    href="/settings"
    style={{
      fontSize: '0.8rem', color: 'hsl(var(--primary))', textDecoration: 'none',
      display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.6rem 1rem',
      borderRadius: '0.75rem', background: 'hsla(var(--primary) / 0.1)',
      border: '1px solid hsla(var(--primary) / 0.2)', fontWeight: 500, transition: 'all 0.2s ease',
    }}
  >
    {hasAccounts ? '⚙️ Manage Channels' : '➕ Connect Account'}
  </Link>
);
