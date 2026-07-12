import React from 'react';
import styles from '@/app/(dashboard)/settings/Settings.module.css';
import { Account } from '@/lib/core/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { ConnectionDisclosure } from './ConnectionDisclosure';
import { ConnectedAccountsList } from './ConnectedAccountsList';

interface ConnectionSectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  provider: string;
  color: string;
  onConnect: () => void;
  onDisconnect: (accountId: string) => void;
  accounts: Account[];
  platformLabel: string; // e.g. "YouTube Channel"
}

export const ConnectionSection: React.FC<ConnectionSectionProps> = ({
  title,
  subtitle,
  icon,
  provider,
  color,
  onConnect,
  onDisconnect,
  accounts,
  platformLabel
}) => {
  const platformAccounts = accounts.filter(a => a.provider === provider);

  return (
    <GlassCard style={{ padding: '1.5rem' }}>
      <div className={styles.connectionCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleSection}>
            <div className={styles.platformIcon} style={{ marginBottom: '0.5rem' }}>{icon}</div>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardSubtitle}>{subtitle}</p>
          </div>
        </div>

        <div>
          <button 
            onClick={onConnect}
            className={styles.connectBtn}
            style={{ 
              background: color, 
              color: 'hsl(var(--primary-foreground))', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem', 
              cursor: 'pointer', 
              fontWeight: 600, 
              transition: 'all 0.2s ease',
              boxShadow: `0 4px 12px ${color === 'black' ? 'rgba(0,0,0,0.2)' : color + '33'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 16px ${color === 'black' ? 'rgba(0,0,0,0.3)' : color + '4D'}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${color === 'black' ? 'rgba(0,0,0,0.2)' : color + '33'}`;
            }}
          >
            {icon && React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<Record<string, unknown>>, { 
              sx: { fontSize: 20, color: 'currentColor' } 
            })}
            <span>Connect {platformLabel}</span>
          </button>

          <ConnectionDisclosure provider={provider} />

          <ConnectedAccountsList 
            platformAccounts={platformAccounts}
            platformLabel={platformLabel}
            color={color}
            onDisconnect={onDisconnect}
          />
        </div>
      </div>
    </GlassCard>
  );
};
