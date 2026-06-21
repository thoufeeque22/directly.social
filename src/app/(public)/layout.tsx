import React from 'react';
import { Box } from '@mui/material';
import { LandingHeader } from '@/components/landing/Header';
import { LandingFooter } from '@/components/landing/Footer';
import { auth } from '@/auth';

/**
 * PublicLayout provides the LandingHeader and LandingFooter for all public routes
 * (e.g., /docs, /privacy, /terms) ONLY when the user is unauthenticated.
 * For authenticated users, it skips them to allow the main dashboard shell to wrap pages.
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAuthenticated = !!session;

  if (isAuthenticated) {
    return (
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    );
  }

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
