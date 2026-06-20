'use client';

import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { inputStyle } from './PlatformMetadataFields.styles';
import { MetadataTemplates } from './MetadataTemplates';

export const FirstCommentField: React.FC = () => {
  const { firstCommentText, handleFirstCommentChange, isUploading } = useUploadFormContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
          Global First Comment
        </label>
        {!isUploading && (
          <MetadataTemplates
            currentValue={firstCommentText}
            category="first_comment"
            onSelect={(val) => {
              const newComment = firstCommentText ? `${firstCommentText}\n${val}` : val;
              handleFirstCommentChange(newComment);
            }}
          />
        )}
      </div>
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
