import React from 'react';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import { VideoFormat } from '@/lib/core/types';

interface Props { videoFormat: VideoFormat; onFormatChange: (f: VideoFormat) => void; }

const FORMATS: { id: VideoFormat; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'short', label: 'Short-form', icon: <PhoneIphoneIcon />, desc: 'Vertical (9:16) • < 60s' },
  { id: 'long', label: 'Long-form', icon: <DesktopWindowsIcon />, desc: 'Landscape (16:9) • Any length' },
];

export const VideoFormatSelector: React.FC<Props> = ({ videoFormat, onFormatChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
    <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Target Video Format</label>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {FORMATS.map(f => (
        <button key={f.id} type="button" aria-pressed={videoFormat === f.id} onClick={() => onFormatChange(f.id)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem',
            border: `1px solid ${videoFormat === f.id ? 'hsl(var(--primary))' : 'hsla(var(--border) / 0.5)'}`,
            background: videoFormat === f.id ? 'hsla(var(--primary) / 0.2)' : 'hsla(var(--muted) / 0.3)',
            color: videoFormat === f.id ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'

          }}
        >
          {f.icon}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{f.label}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{f.desc}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

