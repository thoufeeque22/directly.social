import React from 'react';

export const containerStyle: React.CSSProperties = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '1.5rem', 
  padding: '1.25rem', 
  background: 'hsla(var(--muted)/0.1)', 
  borderRadius: '1rem', 
  border: '1px solid hsla(var(--border)/0.3)' 
};

export const labelStyle: React.CSSProperties = { 
  fontSize: '0.85rem', 
  fontWeight: 700, 
  textTransform: 'uppercase', 
  color: 'hsl(var(--primary))' 
};

export const inputStyle: React.CSSProperties = { 
  background: 'hsla(var(--muted) / 0.3)', 
  padding: '0.75rem 1rem', 
  borderRadius: '0.75rem', 
  border: '1px solid hsla(var(--border) / 0.5)', 
  color: 'hsl(var(--foreground))', 
  width: '100%', 
  outline: 'none', 
  transition: 'border-color 0.2s', 
  fontSize: '0.9rem' 
};
