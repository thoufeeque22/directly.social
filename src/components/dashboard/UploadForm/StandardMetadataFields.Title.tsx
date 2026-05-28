/* eslint-disable max-lines */
import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { AINudge } from '@/components/ui/AINudge';
import UndoIcon from '@mui/icons-material/Undo';

export const TitleField: React.FC = () => {
  const {
    aiTier, isUploading, onTierChange, onVisualScan,
    title, handleTitleChange, titleUndo, handleUndoTitle, handleClearTitle
  } = useUploadFormContext();

  const MAX_TITLE = 100; // Standard for YouTube/Social
  const isNearLimit = title.length > MAX_TITLE * 0.9;
  const isOverLimit = title.length > MAX_TITLE;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="video-title" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
            {aiTier === 'Generate' ? 'Video Prompt' : 'Video Title'}
          </label>
          {aiTier === 'Manual' && (
            <AINudge featureKey="title_generator" message="Try AI Title" tooltipText="Switch to Generate tier" onClick={() => onTierChange('Generate')} />
          )}
          {aiTier === 'Generate' && !isUploading && (
            <button type="button" onClick={async () => {
              const { getDraftFile } = await import('@/lib/upload/file-store');
              const file = await getDraftFile();
              if (file) await onVisualScan(file);
            }} style={scanButtonStyle}>Auto-Scan Video</button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: 600, 
            color: isOverLimit ? 'hsl(var(--destructive))' : isNearLimit ? '#ffb74d' : 'hsl(var(--muted-foreground))'
          }}>
            {title.length}/{MAX_TITLE}
          </span>
          {titleUndo && (
            <button type="button" onClick={handleUndoTitle} style={undoButtonStyle}>
              <UndoIcon sx={{ fontSize: 14 }} /> Undo Clear
            </button>
          )}
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <input id="video-title" data-testid="video-title" type="text" name="title" 
          placeholder={aiTier === 'Generate' ? "Describe your video concept..." : "Catchy title..."}
          value={title} onChange={(e) => handleTitleChange(e.target.value)} required 
          style={{ 
            ...inputStyle, 
            borderColor: isOverLimit ? 'hsl(var(--destructive))' : 'hsla(var(--border) / 0.5)'
          }} 
        />
        {title && <button type="button" onClick={handleClearTitle} style={clearButtonStyle}>✕</button>}
      </div>
      {isOverLimit && (
        <p style={{ color: 'hsl(var(--destructive))', fontSize: '0.7rem', margin: 0, fontWeight: 500 }}>
          Title exceeds the 100 character limit for some platforms.
        </p>
      )}
    </div>
  );
};

const scanButtonStyle: React.CSSProperties = { background: 'hsla(var(--primary)/0.1)', border: '1px solid hsla(var(--primary)/0.3)', color: 'hsl(var(--primary))', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' };
const undoButtonStyle: React.CSSProperties = { background: 'transparent', border: 'none', color: 'hsl(var(--primary))', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };
const inputStyle: React.CSSProperties = { background: 'hsla(var(--muted) / 0.3)', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid hsla(var(--border) / 0.5)', color: 'white', width: '100%', outline: 'none', transition: 'border-color 0.2s' };
const clearButtonStyle: React.CSSProperties = { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'hsla(var(--foreground)/0.1)', border: 'none', color: 'hsl(var(--muted-foreground))', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.7rem', cursor: 'pointer' };
