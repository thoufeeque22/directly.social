'use client';

import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { inputStyle } from './PlatformMetadataFields.styles';

export const HashtagsField: React.FC = () => {
  const { hashtags, handleHashtagsChange } = useUploadFormContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
        Global Hashtags
      </label>
      <input 
        type="text" 
        name="hashtags"
        placeholder="#awesome #video..." 
        value={hashtags} 
        onChange={(e) => handleHashtagsChange(e.target.value)} 
        style={inputStyle} 
      />
    </div>
  );
};
