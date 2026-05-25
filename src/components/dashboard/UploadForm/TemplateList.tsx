'use client';

import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { TemplateItem } from './TemplateItem';

interface Template {
  id: string;
  name: string;
  content: string;
}

interface TemplateListProps {
  isLoading: boolean;
  templates: Template[];
  onSelect: (content: string) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({ isLoading, templates, onSelect }) => {
  if (isLoading) {
    return (
      <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={20} sx={{ color: 'hsl(var(--primary))' }} />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
        No snippets saved yet.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {templates.map(t => (
        <TemplateItem key={t.id} template={t} onSelect={onSelect} />
      ))}
    </div>
  );
};
