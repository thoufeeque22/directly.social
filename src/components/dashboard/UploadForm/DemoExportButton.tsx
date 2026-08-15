import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { useUploadFormContext } from './UploadFormContext';

export const DemoExportButton: React.FC = () => {
  const { draftFile } = useUploadFormContext();

  const handleExport = () => {
    if (!draftFile) return;
    
    // In a real app we'd apply the watermark using a media server or ffmpeg.wasm.
    // For this demo, we simply trigger a download of the current file.
    const isDemo = draftFile.name === 'demo-video.mp4';
    const url = isDemo ? '/dummy.mp4' : URL.createObjectURL(draftFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watermarked_${draftFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (!isDemo) URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
      <button 
        type="button" 
        onClick={handleExport} 
        disabled={!draftFile}
        style={{
          background: 'hsl(var(--primary))', 
          color: 'hsl(var(--primary-foreground))', 
          border: 'none', 
          padding: '8px 16px', 
          borderRadius: '6px', 
          fontSize: '0.9rem',
          fontWeight: 600, 
          cursor: draftFile ? 'pointer' : 'not-allowed', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px'
        }}
      >
        <DownloadIcon sx={{ fontSize: 18 }} />
        Export
      </button>
    </div>
  );
};
