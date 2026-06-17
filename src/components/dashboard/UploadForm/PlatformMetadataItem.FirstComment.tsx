import React from 'react';
import { inputStyle } from './PlatformMetadataFields.styles';

interface PlatformFirstCommentFieldProps {
  platform: string;
  value: string;
  onChange: (p: string, v: string) => void;
}

export const PlatformFirstCommentField: React.FC<PlatformFirstCommentFieldProps> = ({
  platform, value, onChange
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
        {platform} First Comment
      </label>
      <input 
        type="text" 
        name={`first_comment_${platform}`}
        placeholder="Coming soon..." 
        value={value} 
        onChange={(e) => onChange(platform, e.target.value)} 
        style={inputStyle} 
      />
    </div>
  );
};
