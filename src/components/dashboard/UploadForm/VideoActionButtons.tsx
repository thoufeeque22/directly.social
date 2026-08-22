import React from 'react';
import VideocamIcon from '@mui/icons-material/Videocam';
import FolderIcon from '@mui/icons-material/Folder';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import FileUploadIcon from '@mui/icons-material/FileUpload';

export const VideoActionButtons = ({ setShowGallery, isUploading, isDemoMode, setDemoMode }: { setShowGallery: (v: boolean) => void, isUploading: boolean, isDemoMode: boolean, setDemoMode: (v: boolean) => void }) => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {!isUploading && !isDemoMode && (
        <button type="button" onClick={() => setDemoMode(true)} style={btnStyle}>
          <PlayCircleIcon sx={{ fontSize: 12 }} /> Try a Demo Video
        </button>
      )}
      {!isUploading && isDemoMode && (
        <button type="button" onClick={() => setDemoMode(false)} style={btnStyle}>
          <FileUploadIcon sx={{ fontSize: 12 }} /> Upload Your Video
        </button>
      )}
      <label htmlFor="camera-upload" style={btnStyle}>
        <VideocamIcon sx={{ fontSize: 12 }} /> Record Video
      </label>
      <button id="browse-gallery-btn" type="button" onClick={() => setShowGallery(true)} style={btnStyle}>
        <FolderIcon sx={{ fontSize: 12 }} /> Browse
      </button>
    </div>
  );
};

const btnStyle = {
  background: 'hsla(var(--primary) / 0.1)', border: '1px solid hsla(var(--primary) / 0.3)',
  color: 'hsl(var(--primary))', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem',
  fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
};
