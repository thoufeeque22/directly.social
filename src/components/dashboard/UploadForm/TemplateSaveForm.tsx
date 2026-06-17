'use client';

import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

interface TemplateSaveFormProps {
  isSaving: boolean;
  name: string;
  setName: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const TemplateSaveForm: React.FC<TemplateSaveFormProps> = ({ 
  isSaving, name, setName, onSave, onCancel 
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <input
        autoFocus
        type="text"
        data-testid="new-snippet-name-input"
        placeholder="Snippet name (e.g. Bio Link)"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onSave(); } }}
        style={inputStyle}
      />
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          type="button"
          data-testid="confirm-save-snippet"
          onClick={onSave}
          disabled={isSaving || !name.trim()}
          style={saveButtonStyle}
        >
          {isSaving ? <CircularProgress size={12} /> : 'Save'}
        </button>
        <button type="button" onClick={onCancel} style={cancelButtonStyle}>Cancel</button>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = { background: 'hsla(var(--muted)/0.5)', border: '1px solid hsla(var(--border)/0.5)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', color: 'hsl(var(--foreground))', width: '100%' };
const saveButtonStyle: React.CSSProperties = { flex: 1, background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', border: 'none', padding: '4px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' };
const cancelButtonStyle: React.CSSProperties = { background: 'hsla(var(--muted)/0.5)', color: 'hsl(var(--foreground))', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' };
