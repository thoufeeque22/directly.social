'use client';

import React from 'react';
import MovieIcon from '@mui/icons-material/Movie';
import { useUploadFormContext } from './UploadFormContext';
import { VideoPlayerPreview } from './VideoPlayerPreview';

export const VideoSelection: React.FC = () => {
  const { 
    isUploading, 
    setShowGallery, 
    draftFileName, 
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
      <VideoPlayerPreview />
      <div style={{ position: 'relative' }}>
        <label 
          htmlFor="file-upload"
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: 'hsla(var(--muted) / 0.3)', 
            padding: '1.5rem 1rem', 
            borderRadius: '0.75rem', 
            border: '2px dashed hsla(var(--border) / 0.5)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: 'hsl(var(--muted-foreground))',
            fontSize: '0.9rem',
            textAlign: 'center',
            boxSizing: 'border-box',
            width: '100%'
          }} 
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'hsla(var(--primary) / 0.5)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'hsla(var(--border) / 0.5)'}
        >
          <MovieIcon sx={{ fontSize: 32, opacity: 0.5 }} />
          <span style={{ lineHeight: 1.4 }}>Tap here to select a video file</span>
        </label>
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
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: 0
          }} 
        />
      </div>
    </div>
  );
};
