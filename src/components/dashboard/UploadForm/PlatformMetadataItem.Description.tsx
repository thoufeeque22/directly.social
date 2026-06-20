import React from 'react';
import { AINudge } from '@/components/ui/AINudge';
import { MetadataTemplates } from './MetadataTemplates';
import UndoIcon from '@mui/icons-material/Undo';
import { PLATFORM_LIMITS } from '@/lib/core/constants';
import { inputStyle } from './PlatformMetadataFields.styles';
import { clearButtonStyle as globalClearStyle, undoButtonStyle } from './StandardMetadataFields.Title.styles';

import { AITier } from '@/lib/core/constants';

interface PlatformDescriptionFieldProps {
  platform: string;
  isUploading: boolean;
  aiTier: string;
  value: string;
  showUndo: boolean;
  onChange: (p: string, v: string) => void;
  onClear: (p: string) => void;
  onUndo: () => void;
  onTierChange: (t: AITier) => void;
  appendDescription: (v: string, p: string) => void;
}

export const PlatformDescriptionField: React.FC<PlatformDescriptionFieldProps> = ({
  platform, isUploading, aiTier, value, showUndo, onChange, onClear, onUndo, onTierChange, appendDescription
}) => {
  const limits = PLATFORM_LIMITS[platform] || PLATFORM_LIMITS.default;
  const isOver = value.length > limits.description;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
            {platform} Description
          </label>
          {aiTier === 'Manual' && (
            <AINudge featureKey="desc_generator" message="Try AI" tooltipText="Switch to Enrich tier" onClick={() => onTierChange('Enrich')} />
          )}
          {!isUploading && <MetadataTemplates currentValue={value} category="description" onSelect={(val) => appendDescription(val, platform)} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: isOver ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))' }}>
            {value.length}/{limits.description}
          </span>
          {showUndo && (
            <button type="button" onClick={onUndo} style={undoButtonStyle}>
              <UndoIcon sx={{ fontSize: 12 }} /> <span style={{ fontSize: '0.65rem' }}>Undo Clear</span>
            </button>
          )}
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <textarea 
          name={`description_${platform}`}
          placeholder={`Specific ${platform} description...`} 
          value={value} 
          onChange={(e) => onChange(platform, e.target.value)} 
          rows={3} 
          style={{ ...inputStyle, resize: 'none', paddingRight: '2.5rem', borderColor: isOver ? 'hsl(var(--destructive))' : 'hsla(var(--border) / 0.5)' }} 
        />
        {value && (
          <button type="button" onClick={() => onClear(platform)} style={{ ...globalClearStyle, top: '0.75rem', transform: 'none' }}>✕</button>
        )}
      </div>
    </div>
  );
};