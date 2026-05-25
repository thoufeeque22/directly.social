import React from 'react';
import { Account, PlatformPreference } from '@/lib/core/types';
import { PlatformGroup } from './PlatformGroup';

interface PlatformSelectionProps {
  accounts: Account[];
  preferences: PlatformPreference[];
  selectedAccountIds: string[];
  successfulAccountIds?: string[];
  platformStatuses?: Record<string, 'pending' | 'uploading' | 'processing' | 'success' | 'failed' | 'cancelled'>;
  platformErrors?: Record<string, string>;
  onToggleAccount: (id: string) => void;
}

/**
 * PlatformSelection component for choosing distribution channels.
 * Refactored to delegate rendering to PlatformGroup and AccountToggle.
 */
export const PlatformSelection: React.FC<PlatformSelectionProps> = (props) => {
  const { accounts, selectedAccountIds } = props;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Distribution Channels</label>
      </div>
      
      <PlatformGroup {...props} />

      {accounts.length > 0 && selectedAccountIds.length === 0 && (
        <p style={{ fontSize: '0.75rem', color: '#EF4444' }}>
          Please select at least one account.
        </p>
      )}
    </div>
  );
};
