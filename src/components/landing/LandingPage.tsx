'use client';

import React from 'react';
import { Box } from '@mui/material';
import { LandingHeader } from './Header';
import { Hero } from './Hero';
import { SocialProof } from './SocialProof';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { Comparison } from './Comparison';
import { Personas } from './Personas';
import { Testimonials } from './Testimonials';
import { Pricing } from './Pricing';
import { FAQ } from './FAQ';
import { LandingFooter } from './Footer';

export const LandingPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LandingHeader />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <Comparison />
        <Personas />
        <Testimonials />
        <Pricing />
        <FAQ />
      </Box>
      <LandingFooter />
    </Box>
  );
};
