import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { AINudge } from '@/components/ui/AINudge';
import UndoIcon from '@mui/icons-material/Undo';

export const TitleField: React.FC = () => {
  const {
    aiTier, isUploading, onTierChange, onVisualScan,
    title, handleTitleChange, titleUndo, handleUndoTitle, handleClearTitle
  } = useUploadFormContext();

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
        {titleUndo && (
          <button type="button" onClick={handleUndoTitle} style={undoButtonStyle}>
            <UndoIcon sx={{ fontSize: 14 }} /> Undo Clear
          </button>
        )}
      </div>
      <div style={{ position: 'relative' }}>
        <input id="video-title" data-testid="video-title" type="text" name="title" 
          placeholder={aiTier === 'Generate' ? "Describe your video concept..." : "Catchy title..."}
          value={title} onChange={(e) => handleTitleChange(e.target.value)} required style={inputStyle} />
        {title && <button type="button" onClick={handleClearTitle} style={clearButtonStyle}>✕</button>}
      </div>
    </div>
  );
};

const scanButtonStyle: React.CSSProperties = { background: 'hsla(var(--primary)/0.1)', border: '1px solid hsla(var(--primary)/0.3)', color: 'hsl(var(--primary))', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' };
const undoButtonStyle: React.CSSProperties = { background: 'transparent', border: 'none', color: 'hsl(var(--primary))', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };
const inputStyle: React.CSSProperties = { background: 'hsla(var(--muted) / 0.3)', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid hsla(var(--border) / 0.5)', color: 'white', width: '100%' };
const clearButtonStyle: React.CSSProperties = { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'hsla(var(--foreground)/0.1)', border: 'none', color: 'hsl(var(--muted-foreground))', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.7rem', cursor: 'pointer' };
