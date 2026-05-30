/* eslint-disable max-lines */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useMetadataTemplates } from './useMetadataTemplates';
import { TemplateList } from './TemplateList';
import { TemplateSaveForm } from './TemplateSaveForm';

import { useUploadFormContext } from './UploadFormContext';

interface MetadataTemplatesProps {
  onSelect: (content: string) => void;
  platform?: string;
}

export const MetadataTemplates: React.FC<MetadataTemplatesProps> = ({ onSelect, platform }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newName, setNewName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { description, platformDescriptions } = useUploadFormContext();
  const currentContent = platform ? (platformDescriptions[platform] || '') : description;

  const { templates, isLoading, isSaving, saveTemplate } = useMetadataTemplates(isOpen);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSave = async () => {
    try {
      await saveTemplate(newName, currentContent);
      React.startTransition(() => {
        setNewName('');
        setShowSaveForm(false);
        setIsOpen(false);
      });
    } catch { alert('Failed to save template.'); }
  };

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} title="Saved Snippets" data-testid="snippets-trigger" style={triggerButtonStyle}>
        <BookmarkIcon sx={{ fontSize: 12 }} /> Snippets
      </button>

      {isOpen && (
        <div data-testid="snippets-menu" style={menuStyle}>
          <div style={headerStyle}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>Saved Snippets</span>
            <button type="button" onClick={() => setIsOpen(false)} style={closeButtonStyle}><CloseIcon sx={{ fontSize: 14 }} /></button>
          </div>

          <div style={{ padding: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
            <TemplateList isLoading={isLoading} templates={templates} onSelect={(c) => { onSelect(c); setIsOpen(false); }} />
          </div>

          <div style={footerStyle}>
            {!showSaveForm ? (
              <button type="button" data-testid="save-snippet-form-trigger" onClick={() => setShowSaveForm(true)} disabled={!currentContent.trim()} style={{ ...addButtonStyle, opacity: currentContent.trim() ? 1 : 0.5, cursor: currentContent.trim() ? 'pointer' : 'not-allowed' }}>
                <AddIcon sx={{ fontSize: 14 }} /> Save Current as Snippet
              </button>
            ) : (
              <TemplateSaveForm isSaving={isSaving} name={newName} setName={setNewName} onSave={handleSave} onCancel={() => setShowSaveForm(false)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const triggerButtonStyle: React.CSSProperties = { background: 'hsla(var(--primary)/0.1)', border: '1px solid hsla(var(--primary)/0.3)', color: 'hsl(var(--primary))', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };
const menuStyle: React.CSSProperties = { position: 'absolute', top: '100%', right: 0, zIndex: 50, marginTop: '0.5rem', width: '280px', background: 'hsl(var(--card))', border: '1px solid hsla(var(--border)/0.5)', borderRadius: '0.75rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)', overflow: 'hidden', display: 'flex', flexDirection: 'column' };
const headerStyle: React.CSSProperties = { padding: '0.75rem', borderBottom: '1px solid hsla(var(--border)/0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'hsla(var(--muted)/0.3)' };
const closeButtonStyle: React.CSSProperties = { background: 'transparent', border: 'none', color: 'hsl(var(--muted-foreground))', cursor: 'pointer' };
const footerStyle: React.CSSProperties = { padding: '0.75rem', borderTop: '1px solid hsla(var(--border)/0.3)', background: 'hsla(var(--muted)/0.1)' };
const addButtonStyle: React.CSSProperties = { width: '100%', background: 'hsl(var(--primary))', color: 'white', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' };
