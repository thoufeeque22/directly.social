import React from 'react';
import { useVideoPlayer } from './useVideoPlayer';

type Props = ReturnType<typeof useVideoPlayer>;

export const VideoPlayerView: React.FC<Props> = ({ videoRef, canvasRef, videoUrl, captureThumbnail }) => {
  return (
    <div style={{ background: 'hsla(var(--muted) / 0.3)', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid hsla(var(--border) / 0.5)', position: 'relative' }}>
      {videoUrl ? (
        <video 
          ref={videoRef} 
          src={videoUrl} 
          controls 
          onSeeked={captureThumbnail} 
          onLoadedData={captureThumbnail} 
          style={{ width: '100%', maxHeight: '300px', display: 'block', objectFit: 'contain', background: '#000' }} 
        />
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>
          Preview not available for gallery items
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
