import { PlatformResult } from '@/app/schedule/types';
import styles from './calendar.module.css';

export const getPlatformClass = (platforms: PlatformResult[]) => {
  if (!platforms || platforms.length === 0) return styles.platformDefault;
  const p = platforms[0].platform.toLowerCase();
  switch (p) {
    case 'youtube': return styles.platformYoutube;
    case 'instagram': return styles.platformInstagram;
    case 'facebook': return styles.platformFacebook;
    case 'tiktok': return styles.platformTiktok;
    default: return styles.platformDefault;
  }
};
