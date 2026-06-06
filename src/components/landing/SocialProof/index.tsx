'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Tooltip } from '@mui/material';
import { PlatformIcon } from '@/components/ui/PlatformIcon';
import { activePlatforms, upcomingPlatforms } from '../data';

const PlatformLogo = ({ id, isUpcoming }: { id: string, isUpcoming?: boolean }) => {
  // Map internal IDs to brand colors for a subtle pop
  const brandColors: Record<string, string> = {
    tiktok: '#000000',
    instagram: '#E4405F',
    youtube: '#FF0000',
    facebook: '#1877F2',
    linkedin: '#0A66C2',
    threads: '#000000',
    x: '#000000',
    reddit: '#FF4500'
  };

  return (
    <Tooltip title={isUpcoming ? `${id} (Coming Soon)` : `Native ${id} Support`} arrow>
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isUpcoming ? 0.2 : 0.6,
          filter: isUpcoming ? 'grayscale(100%)' : 'none',
          transition: 'all 0.3s ease',
          '&:hover': { 
            opacity: 1, 
            filter: 'none',
            transform: 'scale(1.1)'
          },
          px: { xs: 2, md: 4 },
          py: 2
        }}
      >
        <PlatformIcon 
          platformId={id} 
          sx={{ 
            fontSize: { xs: 32, md: 40 },
            color: isUpcoming ? 'inherit' : brandColors[id.toLowerCase()] || 'inherit'
          }} 
        />
      </Box>
    </Tooltip>
  );
};

export const SocialProof = () => {
  return (
    <Box sx={{ py: 4, bgcolor: 'background.paper', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.2em', opacity: 0.8 }}>
            Native Integration
          </Typography>
          <Stack 
            direction="row" 
            sx={{ 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              alignItems: 'center',
              width: '100%'
            }}
          >
            {activePlatforms.map((p) => (
              <PlatformLogo key={p} id={p} />
            ))}
            {upcomingPlatforms.map((p) => (
              <PlatformLogo key={p} id={p} isUpcoming />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
