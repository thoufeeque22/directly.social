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
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We unconditionally render the LandingHeader and LandingFooter.
  // The LandingHeader can check authentication status client-side via useSession 
  // to avoid forcing this entire route group to be dynamically rendered on the server.
  
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
