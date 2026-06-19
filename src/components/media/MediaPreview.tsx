
'use client';

import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { Box, Typography } from '@mui/material';

interface MediaPreviewProps {
  src?: string;
  isGrid?: boolean;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ src, isGrid }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      if (videoRef.current.currentTime > 0) {
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setAspectRatio(video.videoWidth / video.videoHeight);
  };

  const isVertical = aspectRatio !== null && aspectRatio < 0.9;

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: isGrid ? '100%' : '48px',
        height: isGrid ? (isVertical ? '210px' : '100px') : '48px',
        borderRadius: '10px',
        overflow: 'hidden',
        bgcolor: 'black',
        position: 'relative',
        border: '1px solid hsla(var(--primary) / 0.1)',
        transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {src ? (
        <video
          ref={videoRef}
          src={`${src}#t=0.1`}
          muted
          playsInline
          loop
          onLoadedMetadata={handleMetadata}
          style={{
            width: '100%',
            height: '100%',
            objectFit: isVertical ? 'contain' : 'cover',
            opacity: isHovered ? 1 : 0.8,
            transition: 'opacity 0.3s ease',
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
          }}
        >
          <Film size={isGrid ? 32 : 20} />
        </Box>
      )}
      {src && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            bgcolor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '10px',
            color: 'white',
            fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Typography variant="caption">
            {isVertical ? '9:16 PORTRAIT' : '16:9 LANDSCAPE'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
