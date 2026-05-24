import React from 'react';

export const primaryButtonStyle: React.CSSProperties = {
  background: 'hsl(var(--primary))', 
  color: 'white', 
  border: 'none', 
  padding: '1rem', 
  borderRadius: '0.75rem', 
  fontWeight: 700, 
  boxShadow: '0 4px 12px hsla(var(--primary) / 0.2)', 
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem'
};

export const secondaryButtonStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '1rem',
  borderRadius: '0.75rem',
  background: 'linear-gradient(135deg, hsla(var(--primary) / 0.1), hsla(var(--primary) / 0.05))',
  border: '1px solid hsla(var(--primary) / 0.3)',
  color: 'hsl(var(--primary))',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontSize: '0.9rem'
};

export const skipReviewButtonStyle: React.CSSProperties = {
  background: 'transparent', 
  border: '1px solid hsla(var(--border)/0.5)', 
  color: 'hsl(var(--muted-foreground))', 
  padding: '0.75rem', 
  borderRadius: '0.75rem', 
  fontSize: '0.85rem', 
  cursor: 'pointer', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  gap: '0.5rem'
};
