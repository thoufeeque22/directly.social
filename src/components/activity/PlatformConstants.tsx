import React from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ComputerIcon from '@mui/icons-material/Computer';
import styles from '@/app/activity/activity.module.css';

export const PLATFORM_META: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
  youtube:   { icon: <YouTubeIcon sx={{ fontSize: 18, color: '#FF0000' }} />, label: 'YouTube',   className: styles.platformYoutube },
  instagram: { icon: <InstagramIcon sx={{ fontSize: 18, color: '#E4405F' }} />, label: 'Instagram', className: styles.platformInstagram },
  facebook:  { icon: <FacebookIcon sx={{ fontSize: 18, color: '#1877F2' }} />, label: 'Facebook',  className: styles.platformFacebook },
  tiktok:    { icon: <MusicNoteIcon sx={{ fontSize: 18, color: 'text.primary' }} />, label: 'TikTok',    className: styles.platformTiktok },
  local:     { icon: <ComputerIcon sx={{ fontSize: 18, color: 'text.secondary' }} />, label: 'Local Dev',  className: styles.platformLocal },
};

export const getPlatformMeta = (platform: string) => {
  const resolved = platform.toLowerCase();
  const base = resolved.startsWith('local') ? 'local' : 
               (resolved === 'google' ? 'youtube' : resolved);

  return PLATFORM_META[base] || {
    icon: '',
    label: platform === 'unknown' ? 'Platform' : (platform.length > 15 ? 'External' : platform),
    className: styles.platformDefault,
  };
};
