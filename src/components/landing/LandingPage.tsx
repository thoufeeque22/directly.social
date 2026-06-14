'use client';

import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { Hero } from './Hero';
import { SocialProof } from './SocialProof';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { Comparison } from './Comparison';
import { Personas } from './Personas';
import { Pricing } from './Pricing';
import { FAQ } from './FAQ';

export const LandingPage = () => {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(() => searchParams.get('loggedOut') === 'true');

  useEffect(() => {
    if (searchParams.get('loggedOut') === 'true') {
      // Clean up the URL by removing the query param without refreshing
      const url = new URL(window.location.href);
      url.searchParams.delete('loggedOut');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Hero />
        <SocialProof />
        <Comparison />
        <Personas />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleClose} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%', fontWeight: 500 }}
        >
          Successfully signed out.
        </Alert>
      </Snackbar>
    </>
  );
};
