'use client';

import React from 'react';
import { Box, Container, Typography, Stack, useTheme } from '@mui/material';
import { PlatformIcon } from '@/components/ui/PlatformIcon';

const platforms = ['tiktok', 'instagram', 'youtube', 'facebook', 'linkedin', 'threads', 'x', 'reddit'];

export const SocialProof = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 6, bgcolor: 'action.hover', borderTop: `1px solid ${theme.palette.divider}`, borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Container maxWidth="lg">
        <Stack spacing={4} sx={{ alignItems: 'center' }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: '0.1em' }}>
            Trusted by creators on every platform
          </Typography>
          <Stack 
            direction="row" 
            spacing={{ xs: 4, md: 8 }} 
            sx={{ 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              alignItems: 'center',
              opacity: 0.6, 
              filter: 'grayscale(100%)' 
            }}
          >
            {platforms.map((p) => (
              <Stack key={p} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <PlatformIcon platformId={p} sx={{ fontSize: 32 }} />
                <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' }, textTransform: 'capitalize', fontWeight: 700 }}>
                  {p}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
