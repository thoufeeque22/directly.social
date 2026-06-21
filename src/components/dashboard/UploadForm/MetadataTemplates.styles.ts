import React from 'react';

export const triggerButtonStyle: React.CSSProperties = {
  background: 'hsla(var(--primary)/0.1)',
  border: '1px solid hsla(var(--primary)/0.3)',
  color: 'hsl(var(--primary))',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

export const headerStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderBottom: '1px solid hsla(var(--border)/0.3)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'hsla(var(--muted)/0.3)',
};

export const closeButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'hsl(var(--muted-foreground))',
  cursor: 'pointer',
};

export const footerStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderTop: '1px solid hsla(var(--border)/0.3)',
  background: 'hsla(var(--muted)/0.1)',
};

export const addButtonStyle: React.CSSProperties = {
  width: '100%',
  background: 'hsl(var(--primary))',
  color: 'hsl(var(--primary-foreground))',
  border: 'none',
  padding: '6px',
  borderRadius: '6px',
  fontSize: '0.75rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
};
