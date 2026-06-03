import React from 'react';
import { AINudge } from '@/components/ui/AINudge';
import UndoIcon from '@mui/icons-material/Undo';
import { PLATFORM_LIMITS } from '@/lib/core/constants';
import { inputStyle } from './PlatformMetadataFields.styles';
import { clearButtonStyle as globalClearStyle, undoButtonStyle } from './StandardMetadataFields.Title.styles';

interface PlatformTitleFieldProps {
  platform: string;
  aiTier: string;
  value: string;
  showUndo: boolean;
  onChange: (p: string, v: string) => void;
  onClear: (p: string) => void;
  onUndo: () => void;
  onTierChange: (t: any) => void;
}

export const PlatformTitleField: React.FC<PlatformTitleFieldProps> = ({
  platform, aiTier, value, showUndo, onChange, onClear, onUndo, onTierChange
}) => {
  const limits = PLATFORM_LIMITS[platform] || PLATFORM_LIMITS.default;
  if (!limits.title) return null;
  const isOver = value.length > limits.title;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
            {platform} Title
          </label>
          {aiTier === 'Manual' && (
            <AINudge featureKey="title_generator" message="Try AI" tooltipText="Switch to Generate tier" onClick={() => onTierChange('Generate')} />
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: isOver ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))' }}>
            {value.length}/{limits.title}
          </span>
          {showUndo && (
            <button type="button" onClick={onUndo} style={undoButtonStyle}>
              <UndoIcon sx={{ fontSize: 12 }} /> <span style={{ fontSize: '0.65rem' }}>Undo Clear</span>
            </button>
          )}
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <input 
          type="text" 
          name={`title_${platform}`}
          placeholder={`Catchy ${platform} title...`} 
          value={value} 
          onChange={(e) => onChange(platform, e.target.value)} 
          style={{ ...inputStyle, paddingRight: '2.5rem', borderColor: isOver ? 'hsl(var(--destructive))' : 'hsla(var(--border) / 0.5)' }} 
        />
        {value && (
          <button type="button" onClick={() => onClear(platform)} style={{ ...globalClearStyle, top: '50%' }}>✕</button>
        )}
      </div>
    </div>
  );
};