'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Stack, useTheme, useScrollTrigger } from '@mui/material';
import Link from 'next/link';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export const LandingHeader = () => {
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  return (
    <AppBar 
      position="sticky" 
      elevation={trigger ? 4 : 0}
      component="header"
      sx={{ 
        backgroundColor: trigger ? theme.palette.background.paper : 'transparent',
        backgroundImage: 'none',
        transition: theme.transitions.create(['background-color', 'box-shadow']),
        borderBottom: trigger ? 'none' : `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <RocketLaunchIcon color="primary" />
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                Directly
              </Typography>
            </Stack>
          </Link>

          <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button component={Link} href="#features" color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>Features</Button>
            <Button component={Link} href="#pricing" color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>Pricing</Button>
            <Button component={Link} href="/docs" color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>Docs</Button>
          </Stack>

          <Button
            component={Link}
            href="/login"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Get Started
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
