'use client';

import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useMetadataTemplates } from './useMetadataTemplates';
import { TemplateList } from './TemplateList';
import { TemplateSaveForm } from './TemplateSaveForm';

interface MetadataTemplatesProps {
  currentValue: string;
  onSelect: (content: string) => void;
  category?: string;
}

export const MetadataTemplates: React.FC<MetadataTemplatesProps> = ({ currentValue, onSelect, category }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newName, setNewName] = useState('');

  const isOpen = Boolean(anchorEl);
  const { templates, isLoading, isSaving, saveTemplate } = useMetadataTemplates(isOpen, category);

  const handleClose = () => {
    setAnchorEl(null);
    setShowSaveForm(false);
    setNewName('');
  };

  const handleSave = async () => {
    try {
      await saveTemplate(newName, currentValue);
      React.startTransition(() => {
        handleClose();
      });
    } catch { alert('Failed to save template.'); }
  };

  return (
    <>
      <button type="button" onClick={(e) => setAnchorEl(e.currentTarget)} title="Saved Snippets" data-testid="snippets-trigger" style={triggerButtonStyle}>
        <BookmarkIcon sx={{ fontSize: 12 }} /> Snippets
      </button>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              width: '280px', 
              background: 'hsl(var(--card))', 
              border: '1px solid hsla(var(--border)/0.5)', 
              borderRadius: '0.75rem', 
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)', 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column',
              mt: 0.5
            }
          }
        }}
      >
        <div data-testid="snippets-menu" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={headerStyle}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>Saved Snippets</span>
            <button type="button" onClick={handleClose} style={closeButtonStyle}><CloseIcon sx={{ fontSize: 14 }} /></button>
          </div>

          <div style={{ padding: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
            <TemplateList isLoading={isLoading} templates={templates} onSelect={(c) => { onSelect(c); handleClose(); }} />
          </div>

          <div style={footerStyle}>
            {!showSaveForm ? (
              <button type="button" data-testid="save-snippet-form-trigger" onClick={() => setShowSaveForm(true)} disabled={!(currentValue || '').trim()} style={{ ...addButtonStyle, opacity: (currentValue || '').trim() ? 1 : 0.5, cursor: (currentValue || '').trim() ? 'pointer' : 'not-allowed' }}>
                <AddIcon sx={{ fontSize: 14 }} /> Save Current as Snippet
              </button>
            ) : (
              <TemplateSaveForm isSaving={isSaving} name={newName} setName={setNewName} onSave={handleSave} onCancel={() => setShowSaveForm(false)} />
            )}
          </div>
        </div>
      </Popover>
    </>
  );
};

const triggerButtonStyle: React.CSSProperties = { background: 'hsla(var(--primary)/0.1)', border: '1px solid hsla(var(--primary)/0.3)', color: 'hsl(var(--primary))', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };
const headerStyle: React.CSSProperties = { padding: '0.75rem', borderBottom: '1px solid hsla(var(--border)/0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'hsla(var(--muted)/0.3)' };
const closeButtonStyle: React.CSSProperties = { background: 'transparent', border: 'none', color: 'hsl(var(--muted-foreground))', cursor: 'pointer' };
const footerStyle: React.CSSProperties = { padding: '0.75rem', borderTop: '1px solid hsla(var(--border)/0.3)', background: 'hsla(var(--muted)/0.1)' };
const addButtonStyle: React.CSSProperties = { width: '100%', background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' };
