import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import TvIcon from '@mui/icons-material/Tv';

interface VideoFileDisplayProps {
  fileName: string | null;
  format: 'short' | 'long';
  duration: number | null;
}

const formatDuration = (seconds: number | null): string => {
  if (seconds === null) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

export const VideoFileDisplay: React.FC<VideoFileDisplayProps> = ({ fileName, format, duration }) => {
  if (!fileName) return null;

  const isShort = format === 'short';
  const color = 'hsl(142, 71%, 45%)';
  
  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem',
      padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
      background: 'hsla(142, 71%, 45%, 0.1)', border: '1px solid hsla(142, 71%, 45%, 0.3)',
      marginBottom: '0.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CheckCircleIcon sx={{ fontSize: 16, color }} />
        <span style={{ fontSize: '0.8rem', color }}>
          <strong>{fileName}</strong> attached
        </span>
      </div>
      <div style={{ 
        background: isShort ? 'hsla(var(--primary) / 0.2)' : 'hsla(var(--muted) / 0.4)',
        color: isShort ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
        padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
        textTransform: 'uppercase', border: `1px solid ${isShort ? 'hsla(var(--primary) / 0.3)' : 'hsla(var(--border) / 0.5)'}`,
        display: 'flex', alignItems: 'center', gap: '4px'
      }}>
        {isShort ? <BoltIcon sx={{ fontSize: 14 }} /> : <TvIcon sx={{ fontSize: 14 }} />}
        {isShort ? 'Short-Form' : 'Long-Form'}
        {duration !== null && <span style={{ opacity: 0.8, fontWeight: 500 }}>• {formatDuration(duration)}</span>}
      </div>
    </div>
  );
};

