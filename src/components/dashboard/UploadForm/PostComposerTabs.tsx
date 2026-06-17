'use client';

import React, { useState } from 'react';
import { Tabs, Tab, Box, Badge } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useUploadFormContext } from './UploadFormContext';

const getPlatformIcon = (p: string) => {
  switch (p) {
    case 'youtube': return <YouTubeIcon sx={{ fontSize: 18, color: '#FF0000' }} />;
    case 'tiktok': return <MusicNoteIcon sx={{ fontSize: 18 }} />;
    case 'instagram': return <InstagramIcon sx={{ fontSize: 18, color: '#E4405F' }} />;
    case 'facebook': return <FacebookIcon sx={{ fontSize: 18, color: '#1877F2' }} />;
    default: return <LanguageIcon sx={{ fontSize: 18 }} />;
  }
};

interface PostComposerTabsProps {
  children: (activeIndex: number) => React.ReactNode;
}

export const PostComposerTabs: React.FC<PostComposerTabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { selectedPlatforms, overriddenPlatforms } = useUploadFormContext();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable" 
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 100,
              fontSize: '0.875rem',
              fontWeight: 500
            }
          }}
        >
          <Tab icon={<LanguageIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Global" />
          {selectedPlatforms.map((platform) => (
            <Tab 
              key={platform}
              icon={
                <Badge 
                  variant="dot" 
                  color="primary" 
                  invisible={!overriddenPlatforms.includes(platform)}
                >
                  {getPlatformIcon(platform)}
                </Badge>
              } 
              iconPosition="start" 
              label={platform.charAt(0).toUpperCase() + platform.slice(1)} 
            />
          ))}
        </Tabs>
      </Box>
      <Box>
        {children(activeTab)}
      </Box>
    </Box>
  );
};
