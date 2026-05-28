import React from 'react';

export const disclaimerStyle: React.CSSProperties = { 
  padding: '1rem', 
  borderRadius: '0.75rem', 
  background: 'hsla(45, 100%, 50%, 0.05)', 
  border: '1px solid hsla(45, 100%, 50%, 0.2)',
  marginBottom: '1.5rem' 
};

export const inputStyle = (isError: boolean): React.CSSProperties => ({ 
  background: 'hsla(var(--muted) / 0.3)', 
  padding: '0.8rem 1rem', 
  borderRadius: '0.75rem', 
  border: `1px solid ${isError ? 'hsl(var(--destructive))' : 'hsla(var(--border) / 0.5)'}`,
  color: 'white',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s'
});

export const textareaStyle = (isError: boolean): React.CSSProperties => ({ 
  ...inputStyle(isError),
  fontSize: '0.9rem',
  lineHeight: 1.5,
  resize: 'none'
});

export const tagStyle: React.CSSProperties = { 
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.75rem', 
  background: 'hsla(var(--muted) / 0.5)', 
  padding: '2px 8px', 
  borderRadius: '4px',
  color: 'hsl(var(--primary))'
};
