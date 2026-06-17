'use client';

import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { inputStyle } from './PlatformMetadataFields.styles';

export const FirstCommentField: React.FC = () => {
  const { firstCommentText, handleFirstCommentChange } = useUploadFormContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
        Global First Comment
      </label>
      <textarea 
        name="firstComment"
        placeholder="Write a first comment for all platforms..." 
        value={firstCommentText} 
        onChange={(e) => handleFirstCommentChange(e.target.value)} 
        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
      />
    </div>
  );
};
