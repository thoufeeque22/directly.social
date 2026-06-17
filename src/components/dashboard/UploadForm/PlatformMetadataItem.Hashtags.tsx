import React from 'react';
import { inputStyle } from './PlatformMetadataFields.styles';

interface PlatformHashtagsFieldProps {
  platform: string;
  value: string;
  onChange: (p: string, v: string) => void;
}

export const PlatformHashtagsField: React.FC<PlatformHashtagsFieldProps> = ({
  platform, value, onChange
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
        {platform} Hashtags
      </label>
      <input 
        type="text" 
        name={`hashtags_${platform}`}
        placeholder="#awesome #video..." 
        value={value} 
        onChange={(e) => onChange(platform, e.target.value)} 
        style={inputStyle} 
      />
    </div>
  );
};
