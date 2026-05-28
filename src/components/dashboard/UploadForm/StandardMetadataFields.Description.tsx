/* eslint-disable max-lines */
import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { AINudge } from '@/components/ui/AINudge';
import { MetadataTemplates } from './MetadataTemplates';
import UndoIcon from '@mui/icons-material/Undo';

export const DescriptionField: React.FC = () => {
  const {
    aiTier, isUploading, onTierChange, description, handleDescriptionChange, 
    descUndo, handleUndoDesc, handleClearDesc, appendDescription
  } = useUploadFormContext();

  const MAX_DESC = 2200; // Instagram/Common baseline
  const isNearLimit = description.length > MAX_DESC * 0.9;
  const isOverLimit = description.length > MAX_DESC;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label htmlFor="video-description" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
            {aiTier === 'Generate' ? 'Context' : 'Description'}
          </label>
          {aiTier === 'Manual' && (
            <AINudge featureKey="desc_generator" message="Try AI Polish" tooltipText="Switch to Enrich tier" onClick={() => onTierChange('Enrich')} />
          )}
          {!isUploading && <MetadataTemplates onSelect={(val) => appendDescription(val)} currentContent={description} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: 600, 
            color: isOverLimit ? 'hsl(var(--destructive))' : isNearLimit ? '#ffb74d' : 'hsl(var(--muted-foreground))'
          }}>
            {description.length}/{MAX_DESC}
          </span>
          {descUndo && (
            <button type="button" onClick={handleUndoDesc} style={undoButtonStyle}>
              <UndoIcon sx={{ fontSize: 14 }} /> Undo Clear
            </button>
          )}
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <textarea id="video-description" data-testid="video-description" name="description" 
          placeholder={aiTier === 'Generate' ? "Specific keywords or links..." : "Video description..."}
          value={description} onChange={(e) => handleDescriptionChange(e.target.value)} rows={3} 
          style={{ 
            ...textareaStyle, 
            borderColor: isOverLimit ? 'hsl(var(--destructive))' : 'hsla(var(--border) / 0.5)'
          }} 
        />
        {description && <button type="button" onClick={handleClearDesc} style={clearButtonStyle}>✕</button>}
      </div>
    </div>
  );
};

const undoButtonStyle: React.CSSProperties = { background: 'transparent', border: 'none', color: 'hsl(var(--primary))', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };
const textareaStyle: React.CSSProperties = { background: 'hsla(var(--muted) / 0.3)', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid hsla(var(--border) / 0.5)', color: 'white', width: '100%', resize: 'none', outline: 'none', transition: 'border-color 0.2s' };
const clearButtonStyle: React.CSSProperties = { position: 'absolute', right: '0.75rem', top: '0.75rem', background: 'hsla(var(--foreground)/0.1)', border: 'none', color: 'hsl(var(--muted-foreground))', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.7rem', cursor: 'pointer' };
