import React from 'react';

export const undoButtonStyle: React.CSSProperties = { 
  background: 'transparent', 
  border: 'none', 
  color: 'hsl(var(--primary))', 
  fontSize: '0.75rem', 
  fontWeight: 600, 
  cursor: 'pointer', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '4px' 
};

export const textareaStyle: React.CSSProperties = { 
  background: 'hsla(var(--muted) / 0.3)', 
  padding: '0.75rem 2.5rem 0.75rem 1rem', 
  borderRadius: '0.75rem', 
  border: '1px solid hsla(var(--border) / 0.5)', 
  color: 'white', 
  width: '100%', 
  resize: 'none', 
  outline: 'none', 
  transition: 'border-color 0.2s' 
};

export const clearButtonStyle: React.CSSProperties = { 
  position: 'absolute', 
  right: '0.75rem', 
  top: '0.75rem', 
  background: 'hsla(var(--foreground)/0.1)', 
  border: 'none', 
  color: 'hsl(var(--muted-foreground))', 
  borderRadius: '50%', 
  width: '20px', 
  height: '20px', 
  fontSize: '0.7rem', 
  cursor: 'pointer' 
};
