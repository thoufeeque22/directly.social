import React from 'react';
import { inputStyle } from './PlatformMetadataFields.styles';

interface PlatformScheduleFieldProps {
  platform: string;
  value: string;
  onChange: (p: string, v: string) => void;
}

export const PlatformScheduleField: React.FC<PlatformScheduleFieldProps> = ({
  platform, value, onChange
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
        {platform} Scheduling Override
      </label>
      <input 
        type="datetime-local" 
        name={`scheduled_at_${platform}`}
        value={value} 
        onChange={(e) => onChange(platform, e.target.value)} 
        style={inputStyle} 
      />
    </div>
  );
};
