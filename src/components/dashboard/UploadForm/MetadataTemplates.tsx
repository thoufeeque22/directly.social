'use client';

import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useMetadataTemplates } from './useMetadataTemplates';
import { TemplateList } from './TemplateList';
import { TemplateSaveForm } from './TemplateSaveForm';
import {
  triggerButtonStyle,
  headerStyle,
  closeButtonStyle,
  footerStyle,
  addButtonStyle,
  popoverPaperSx,
  menuContainerStyle,
  listContainerStyle,
} from './MetadataTemplates.styles';

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
            sx: popoverPaperSx
          }
        }}
      >
        <div data-testid="snippets-menu" style={menuContainerStyle}>
          <div style={headerStyle}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>Saved Snippets</span>
            <button type="button" onClick={handleClose} style={closeButtonStyle}><CloseIcon sx={{ fontSize: 14 }} /></button>
          </div>

          <div style={listContainerStyle}>
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
