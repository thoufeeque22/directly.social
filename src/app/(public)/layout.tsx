import React from 'react';
import { Box } from '@mui/material';
import { LandingHeader } from '@/components/landing/Header';
import { LandingFooter } from '@/components/landing/Footer';

/**
 * PublicLayout provides the LandingHeader and LandingFooter for all public routes
 * (e.g., /docs, /privacy, /terms).
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LandingHeader />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <LandingFooter />
    </Box>
  );
}
