import React from 'react';
import { StatusIcon } from './StatusIcon';

interface AccountToggleProps {
  id: string;
  platform: string;
  displayName: string;
  isSelected: boolean;
  status?: 'pending' | 'uploading' | 'processing' | 'success' | 'failed' | 'cancelled';
  error?: string;
  onToggle: (id: string) => void;
}

export const AccountToggle: React.FC<AccountToggleProps> = ({
  id, platform, displayName, isSelected, status, error, onToggle,
}) => {
  const isUploading = status === 'uploading' || status === 'processing';
  const isSuccess = status === 'success';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => onToggle(id)}
        disabled={isUploading || isSuccess}
        style={{
          position: 'relative', padding: '0.6rem 1rem', borderRadius: '0.75rem',
          border: isSelected ? '2px solid hsl(var(--primary))' : '1px solid hsla(var(--border) / 0.5)',
          background: isSelected ? 'hsla(var(--primary) / 0.2)' : 'hsla(var(--muted) / 0.2)',
          color: isSelected ? 'white' : 'hsl(var(--muted-foreground))',
          cursor: isUploading || isSuccess ? 'not-allowed' : 'pointer',
          fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          boxShadow: isSelected && !isUploading && !isSuccess ? '0 0 20px hsla(var(--primary) / 0.4)' : 'none',
          opacity: status === 'cancelled' ? 0.5 : 1, overflow: 'hidden',
        }}
      >
        {isUploading && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', background: 'hsl(var(--primary))', width: '40%', transition: 'width 0.3s' }} />
        )}
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: isSelected ? 'hsl(var(--primary))' : 'transparent',
          border: isSelected ? 'none' : '1px solid hsla(var(--muted-foreground) / 0.5)',
        }} />
        <span style={{ opacity: 0.7, textTransform: 'capitalize' }}>{platform}:</span> {displayName}
        <StatusIcon status={status} />
      </button>
      {status === 'failed' && error && (
        <span style={{ fontSize: '0.65rem', color: '#EF4444', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {error}
        </span>
      )}
    </div>
  );
};
