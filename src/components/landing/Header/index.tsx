'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Stack, useTheme, useScrollTrigger, Box } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useSession } from 'next-auth/react';

import { BRAND } from '@/lib/core/brand';

export const LandingHeader = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      // Most reliable way to scroll to top across all browsers
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Fallback for some mobile browsers
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={trigger ? 4 : 0}
      component="header"
      data-testid="landing-header"
      sx={{ 
        backgroundColor: trigger ? 'hsla(var(--background), 0.8)' : 'transparent',
        backgroundImage: 'none',
        backdropFilter: trigger ? 'blur(12px)' : 'none',
        transition: theme.transitions.create(['background-color', 'box-shadow', 'backdrop-filter']),
        borderBottom: trigger ? `1px solid ${theme.palette.divider}` : 'none',
        color: theme.palette.text.primary,
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ flexShrink: 0 }}>
            <Link href="/" onClick={handleLogoClick} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <RocketLaunchIcon color="primary" />
                <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                  {BRAND.name}
                </Typography>
              </Stack>
            </Link>
          </Box>

          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'center' }}>
            <Button component={Link} href="/philosophy" color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>Philosophy</Button>
            <Button component={Link} href="/#features" color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>Features</Button>
            <Button component={Link} href="/#pricing" color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>Pricing</Button>
            <Button component={Link} href="/docs" color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>Docs</Button>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ alignItems: 'center', flexShrink: 0 }}>
            {isAuthenticated ? (
              <Button
                component={Link}
                href="/"
                variant="contained"
                color="primary"
                sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Link href="/login" style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', '&:hover': { color: 'primary.main' } }}>
                    Login
                  </Typography>
                </Link>
                <Button
                  component={Link}
                  href="/login"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
