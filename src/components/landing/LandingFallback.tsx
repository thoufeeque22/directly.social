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
      {/* Hero Skeleton Shell */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
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
