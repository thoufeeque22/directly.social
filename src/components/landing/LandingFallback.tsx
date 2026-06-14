'use client';

import React from 'react';
import { Box, Container, Stack, Skeleton } from '@mui/material';

/**
 * A minimal skeleton for the landing page to prevent layout shift during hydration.
 * Matches the structure of LandingHeader + Hero.
 */
export const LandingFallback = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header Skeleton Shell */}
      <Box 
        component="header" 
        sx={{ 
          height: '64px', 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton variant="rectangular" width={120} height={24} sx={{ borderRadius: 1 }} />
            <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Skeleton variant="text" width={60} />
              <Skeleton variant="text" width={60} />
              <Skeleton variant="text" width={60} />
            </Stack>
            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
          </Stack>
        </Container>
      </Box>

      {/* Hero Skeleton Shell */}
      <Box sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Stack spacing={4} sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Skeleton variant="text" width="80%" height={60} sx={{ maxWidth: 600 }} />
            <Skeleton variant="text" width="60%" height={30} sx={{ maxWidth: 400 }} />
            <Stack direction="row" spacing={2}>
              <Skeleton variant="rectangular" width={150} height={48} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" width={150} height={48} sx={{ borderRadius: 2 }} />
            </Stack>
            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 4, mt: 4 }} />
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
