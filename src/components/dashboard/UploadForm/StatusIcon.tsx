import React from 'react';

interface StatusIconProps {
  status?: 'pending' | 'uploading' | 'processing' | 'success' | 'failed' | 'cancelled';
}

export const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  if (status === 'uploading' || status === 'processing') {
    return (
      <span
        className="animate-spin"
        style={{
          marginLeft: 'auto', display: 'inline-block', width: '12px', height: '12px',
          border: '2px solid hsla(var(--primary)/0.3)', borderTopColor: 'hsl(var(--primary))',
          borderRadius: '50%',
        }}
      />
    );
  }
  if (status === 'success') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', marginLeft: 'auto' }}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (status === 'failed') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', marginLeft: 'auto' }}>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  return null;
};
