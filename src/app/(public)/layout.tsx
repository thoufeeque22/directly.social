"use client";

import React from 'react';
import { Box } from '@mui/material';
import { LandingHeader } from '@/components/landing/Header';
import { LandingFooter } from '@/components/landing/Footer';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

/**
 * PublicLayout provides the LandingHeader and LandingFooter for all public routes.
 * It intelligently avoids rendering them when the user is viewing the Dashboard
 * (which happens at the root path '/' when authenticated).
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  // The Dashboard is rendered at the root path for authenticated users.
  // In this case, the LayoutWrapper will provide the App Shell (Sidebar/Header),
  // so we should not render the Landing UI here.
  const isDashboard = pathname === '/' && isAuthenticated;

  if (isDashboard) {
    return <>{children}</>;
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
