import React from 'react';
import styles from '@/app/(dashboard)/settings/Settings.module.css';
import { Account } from '@/lib/core/types';
import { formatHandle } from '@/lib/utils/utils';

interface ConnectedAccountsListProps {
  platformAccounts: Account[];
  platformLabel: string;
  color: string;
  onDisconnect: (accountId: string) => void;
}

export const ConnectedAccountsList: React.FC<ConnectedAccountsListProps> = ({
  platformAccounts,
  platformLabel,
  color,
  onDisconnect,
}) => {
  if (platformAccounts.length === 0) return null;

  return (
    <div className={styles.connectedList}>
      <p className={styles.connectedTitle}>Connected:</p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {platformAccounts.map(acc => (
          <div 
            key={acc.id} 
            className={styles.handlePill}
            style={{ 
              background: `${color}1A`, 
              color: color === 'white' ? 'white' : color, 
              border: color === 'white' ? '1px solid rgba(255,255,255,0.2)' : `1px solid ${color}33`,
            }}
          >
            <span>{formatHandle(acc.accountName, platformLabel)}</span>
            <button
              onClick={() => onDisconnect(acc.id)}
              title="Disconnect account"
              className={styles.removeBtn}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
