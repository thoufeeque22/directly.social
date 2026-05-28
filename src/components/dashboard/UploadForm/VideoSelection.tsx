/* eslint-disable max-lines */
'use client';

import React from 'react';
import MovieIcon from '@mui/icons-material/Movie';
import { useUploadFormContext } from './UploadFormContext';
import { VideoFileDisplay } from './VideoFileDisplay';

export const VideoSelection: React.FC = () => {
  const { 
    isUploading, 
    setShowGallery, 
    draftFileName, 
    videoFormat, 
    videoDuration, 
    onFileChange 
  } = useUploadFormContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label htmlFor="file-upload" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Select Video File</label>
        {!isUploading && (
          <button 
            id="browse-gallery-btn"
            type="button"
            onClick={() => setShowGallery(true)}
            style={{ 
              background: 'hsla(var(--primary) / 0.1)', 
              border: '1px solid hsla(var(--primary) / 0.3)',
              color: 'hsl(var(--primary))',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <MovieIcon sx={{ fontSize: 12 }} />
            Browse Gallery
          </button>
        )}
      </div>
      <VideoFileDisplay fileName={draftFileName} format={videoFormat} duration={videoDuration} />
      <input 
        id="file-upload"
        type="file" 
        name="file" 
        accept="video/*" 
        required={!draftFileName}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileChange(file);
        }}
        style={{ 
          background: 'hsla(var(--muted) / 0.3)', 
          padding: '1rem', 
          borderRadius: '0.75rem', 
          border: '1px dashed hsla(var(--border) / 0.5)',
          cursor: 'pointer'
        }} 
      />
    </div>
  );
};
