'use client';

import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { DashboardMockup } from './DashboardMockup';
import { HeroActions } from './HeroActions';

export const Hero = () => {

  return (
    <Box sx={{ pt: { xs: 12, md: 16 }, pb: { xs: 6, md: 10 }, overflow: 'hidden', position: 'relative' }}>
      {/* Warm Studio Lighting */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '0%', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '100%', 
          height: '80%', 
          background: 'radial-gradient(ellipse at top, hsla(var(--primary), 0.05) 0%, transparent 80%)', 
          filter: 'blur(120px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} 
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4} sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }, 
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}
          >
            The <Box component="span" sx={{ color: 'primary.main' }}>Local-First</Box> Creator Studio
          </Typography>

          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 800, 
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
            <strong>Pro Tools. No SaaS Tax.</strong> Stop paying markups on your <strong>Shorts, Reels, and TikToks</strong>. No middlemen, no markups, just your own storage and the platforms you love.
          </Typography>


          
          <HeroActions />
          
          <Typography variant="body2" color="text.secondary">
            No credit card required. Free forever core tier.
          </Typography>
          
          <DashboardMockup />
        </Stack>
      </Container>
    </Box>
  );
};
