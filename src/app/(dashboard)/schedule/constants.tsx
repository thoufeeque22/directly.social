import React from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

export const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  youtube: <YouTubeIcon sx={{ fontSize: 16, color: '#FF0000' }} />,
  instagram: <InstagramIcon sx={{ fontSize: 16, color: '#E4405F' }} />,
  facebook: <FacebookIcon sx={{ fontSize: 16, color: '#1877F2' }} />,
  tiktok: <MusicNoteIcon sx={{ fontSize: 16, color: '#000000' }} />
};
