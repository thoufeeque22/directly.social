/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { useVideoPlayer } from './useVideoPlayer';
import { VideoPlayerView } from './VideoPlayerView';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const VideoPlayerPreview: React.FC = () => {
  const { draftFile, videoFormat, videoDuration, draftFileName } = useUploadFormContext();
  const player = useVideoPlayer(draftFile);

  if (!draftFileName && !draftFile) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: 'hsla(142, 71%, 45%, 0.1)', border: '1px solid hsla(142, 71%, 45%, 0.3)' }}>
        <CheckCircleIcon sx={{ fontSize: 16, color: 'hsl(142, 71%, 45%)' }} />
        <span style={{ fontSize: '0.8rem', color: 'hsl(142, 71%, 45%)' }}><strong>{draftFileName}</strong> attached</span>
      </div>
      <VideoPlayerView {...player} />
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Format: <strong>{videoFormat === 'short' ? 'Short-Form' : 'Long-Form'}</strong>{videoDuration && ` • Duration: ${Math.round(videoDuration)}s`}</div>
        {(videoFormat === 'short' && videoDuration && videoDuration > 90) && <div style={{ color: 'hsl(var(--destructive))', fontSize: '0.8rem', fontWeight: 600 }}>Warning: Exceeds 90s short limit</div>}
      </div>
      {player.thumbnailUrl && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
          <img src={player.thumbnailUrl} alt="Thumb" style={{ width: '60px', borderRadius: '4px', border: '1px solid hsla(var(--border) / 0.5)' }} />
          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Generated Thumbnail</span>
        </div>
      )}
    </div>
  );
};
