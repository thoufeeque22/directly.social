import React from 'react';
import { SvgIconProps } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import { TiktokIcon } from './icons/TiktokIcon';
import { ThreadsIcon } from './icons/ThreadsIcon';
import { RedditIcon } from './icons/RedditIcon';
import { XIconCustom } from './icons/XIcon';

interface PlatformIconProps extends SvgIconProps {
  platformId: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platformId, ...props }) => {
  switch (platformId.toLowerCase()) {
    case 'youtube':
      return <YouTubeIcon {...props} />;
    case 'instagram':
      return <InstagramIcon {...props} />;
    case 'tiktok':
      return <TiktokIcon {...props} />;
    case 'facebook':
      return <FacebookIcon {...props} />;
    case 'linkedin':
      return <LinkedInIcon {...props} />;
    case 'twitter':
    case 'x':
      return <XIconCustom {...props} />;
    case 'reddit':
      return <RedditIcon {...props} />;
    case 'pinterest':
      return <PinterestIcon {...props} />;
    case 'threads':
      return <ThreadsIcon {...props} />;
    default:
      return null;
  }
};
