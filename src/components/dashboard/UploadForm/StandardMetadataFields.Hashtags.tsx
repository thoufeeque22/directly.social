'use client';

import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { inputStyle } from './PlatformMetadataFields.styles';
import { MetadataTemplates } from './MetadataTemplates';

export const HashtagsField: React.FC = () => {
  const { hashtags, handleHashtagsChange, isUploading } = useUploadFormContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
          Global Hashtags
        </label>
        {!isUploading && (
          <MetadataTemplates
            currentValue={hashtags}
            category="hashtags"
            onSelect={(val) => {
              const newHashtags = hashtags ? `${hashtags} ${val}` : val;
              handleHashtagsChange(newHashtags);
            }}
          />
        )}
      </div>
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
