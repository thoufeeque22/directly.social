import React from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Button } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import { labelStyle } from './PlatformMetadataFields.styles';

export const getPlatformIcon = (p: string) => {
  switch (p) {
    case 'youtube': return <YouTubeIcon sx={{ fontSize: 18, color: '#FF0000' }} />;
    case 'tiktok': return <MusicNoteIcon sx={{ fontSize: 18 }} />;
    case 'instagram': return <InstagramIcon sx={{ fontSize: 18, color: '#E4405F' }} />;
    case 'facebook': return <FacebookIcon sx={{ fontSize: 18, color: '#1877F2' }} />;
    default: return <LanguageIcon sx={{ fontSize: 18 }} />;
  }
};

interface PlatformHeaderProps {
  platform: string;
  onReset: (p: string) => void;
}

export const PlatformHeader: React.FC<PlatformHeaderProps> = ({ platform, onReset }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid hsla(var(--border)/0.3)', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {getPlatformIcon(platform)}
      <span style={labelStyle}>{platform} Details</span>
    </div>
    <Button 
      size="small" startIcon={<UndoIcon />} onClick={() => onReset(platform)}
      sx={{ fontSize: '0.7rem', textTransform: 'none', color: 'hsl(var(--muted-foreground))' }}
    >
      Reset to Global
    </Button>
  </div>
);
