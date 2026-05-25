'use client';

import React, { useState, useEffect, useRef } from 'react';
import MovieIcon from '@mui/icons-material/Movie';

export const MediaPreview: React.FC<{ src?: string }> = ({ src }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      if (videoRef.current.currentTime > 0) videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setAspectRatio(video.videoWidth / video.videoHeight);
  };

  const isVertical = aspectRatio !== null && aspectRatio < 0.9;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden',
        background: 'black', position: 'relative', border: '1px solid hsla(var(--primary) / 0.1)'
      }}
    >
      {src ? (
        <video 
          ref={videoRef} src={`${src}#t=0.1`} muted playsInline loop
          onLoadedMetadata={handleMetadata}
          style={{ width: '100%', height: '100%', objectFit: isVertical ? 'contain' : 'cover', opacity: isHovered ? 1 : 0.7 }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--primary))' }}>
          <MovieIcon sx={{ fontSize: 18 }} />
        </div>
      )}
    </div>
  );
};
