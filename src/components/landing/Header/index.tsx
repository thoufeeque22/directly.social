'use client';

import React from 'react';
import { AppBar, Toolbar, Container, useTheme, useScrollTrigger } from '@mui/material';
import { HeaderLogo } from './HeaderLogo';
import { HeaderNav } from './HeaderNav';
import { HeaderActions } from './HeaderActions';

export const LandingHeader = () => {
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

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
        zIndex: theme.zIndex.appBar,
        pt: 'env(safe-area-inset-top)',
        pl: 'env(safe-area-inset-left)',
        pr: 'env(safe-area-inset-right)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <HeaderLogo />
          <HeaderNav />
          <HeaderActions />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
