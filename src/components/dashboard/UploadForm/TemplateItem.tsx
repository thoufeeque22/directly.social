'use client';

import React from 'react';

interface Template {
  id: string;
  name: string;
  content: string;
}

interface TemplateItemProps {
  template: Template;
  onSelect: (content: string) => void;
}

export const TemplateItem: React.FC<TemplateItemProps> = ({ template, onSelect }) => {
  return (
    <button
      type="button"
      data-testid={`snippet-item-${template.id}`}
      onClick={() => onSelect(template.content)}
      style={itemStyle}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'hsla(var(--primary)/0.1)';
        e.currentTarget.style.borderColor = 'hsla(var(--primary)/0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--foreground))' }}>{template.name}</span>
      <span style={contentPreviewStyle}>{template.content}</span>
    </button>
  );
};

const itemStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.6rem 0.75rem',
  borderRadius: '0.5rem',
  background: 'transparent',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
};

const contentPreviewStyle: React.CSSProperties = {
  fontSize: '0.7rem', 
  color: 'hsl(var(--muted-foreground))',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%'
};
