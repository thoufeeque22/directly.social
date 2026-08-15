'use client';
import React, { useState, useEffect } from 'react';
import MovieIcon from '@mui/icons-material/Movie';
import { useUploadFormContext } from './UploadFormContext';
import { VideoPlayerPreview } from './VideoPlayerPreview';
import { VideoActionButtons } from './VideoActionButtons';
import { DemoExportButton } from './DemoExportButton';

export const VideoSelection: React.FC = () => {
  const { isUploading, setShowGallery, draftFileName, onFileChange } = useUploadFormContext();
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (isDemoMode && draftFileName !== 'demo-video.mp4') {
      const demoFile = new File([], 'demo-video.mp4', { type: 'video/mp4' });
      onFileChange(demoFile);
    } else if (!isDemoMode && draftFileName === 'demo-video.mp4') {
      onFileChange(null);
    }
  }, [isDemoMode, draftFileName, onFileChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsDemoMode(false);
      onFileChange(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Select Video File</label>
        <VideoActionButtons 
          setShowGallery={setShowGallery} isUploading={isUploading} 
          isDemoMode={isDemoMode} setDemoMode={setIsDemoMode} 
        />
      </div>
      <VideoPlayerPreview />
      {isDemoMode && <DemoExportButton />}
      <div style={{ position: 'relative' }}>
        <label htmlFor="file-upload" style={uploadBoxStyle}>
          <MovieIcon sx={{ fontSize: 32, opacity: 0.5 }} />
          <span>Tap here to select a video file</span>
        </label>
        <input id="file-upload" type="file" name="file" accept="video/*" required={!draftFileName} onChange={handleFileChange} style={hiddenInputStyle} />
        <input id="camera-upload" type="file" name="camera_file" accept="video/*" capture="environment" required={!draftFileName} onChange={handleFileChange} style={hiddenInputStyle} />
      </div>
    </div>
  );
};

const uploadBoxStyle = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: '0.5rem', background: 'hsla(var(--muted) / 0.3)', padding: '1.5rem 1rem', 
  borderRadius: '0.75rem', border: '2px dashed hsla(var(--border) / 0.5)', cursor: 'pointer',
  transition: 'all 0.2s ease', color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem',
  textAlign: 'center', boxSizing: 'border-box', width: '100%'
} as React.CSSProperties;

const hiddenInputStyle = {
  position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px',
  overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0
} as React.CSSProperties;
