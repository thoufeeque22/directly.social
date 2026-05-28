import React from 'react';
import { AIWriteResult } from '@/lib/utils/ai-writer';
import { inputStyle, textareaStyle, tagStyle } from './AIContentReview.styles';

interface FieldsProps {
  activePlatform: string;
  activeData: AIWriteResult;
  limits: { title?: number; description: number };
  onUpdate: (field: keyof AIWriteResult, value: string | string[]) => void;
}

export const ReviewFields: React.FC<FieldsProps> = ({ activePlatform, activeData, limits, onUpdate }) => {
  const isTitleOver = limits.title ? activeData.title.length > limits.title : false;
  const isDescOver = activeData.description.length > limits.description;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={labelStyle}>{activePlatform === 'youtube' ? 'Video Title' : 'Campaign Hook'}</label>
          {limits.title && <span style={counterStyle(isTitleOver)}>{activeData.title.length}/{limits.title}</span>}
        </div>
        <input type="text" value={activeData.title} onChange={(e) => onUpdate('title', e.target.value)} style={inputStyle(isTitleOver)} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={labelStyle}>Description & Hashtags</label>
          <span style={counterStyle(isDescOver)}>{activeData.description.length}/{limits.description}</span>
        </div>
        <textarea value={activeData.description} onChange={(e) => onUpdate('description', e.target.value)} rows={5} style={textareaStyle(isDescOver)} />
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' };
const counterStyle = (isOver: boolean): React.CSSProperties => ({ fontSize: '0.7rem', fontWeight: 600, color: isOver ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))' });
