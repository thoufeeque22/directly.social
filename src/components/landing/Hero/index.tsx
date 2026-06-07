'use client';

import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import Link from 'next/link';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { DashboardMockup } from './DashboardMockup';

export const Hero = () => {
  return (
    <Box sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 10 }, overflow: 'hidden', position: 'relative' }}>
      {/* Studio Aura Glow */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '10%', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '80%', 
          height: '60%', 
          background: 'radial-gradient(circle, hsla(var(--primary), 0.08) 0%, transparent 70%)', 
          filter: 'blur(100px)',
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


          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              size="large"
              startIcon={<RocketLaunchIcon />}
              sx={{ py: 1.5, px: 4, borderRadius: 2, fontSize: '1.1rem', textTransform: 'none' }}
            >
              Get Started for Free
            </Button>
            <Button
              component={Link}
              href="/#features"
              variant="outlined"
              size="large"
              sx={{ py: 1.5, px: 4, borderRadius: 2, fontSize: '1.1rem', textTransform: 'none' }}
            >
              Explore Features
            </Button>
          </Stack>
          
          <Typography variant="body2" color="text.secondary">
            No credit card required. Free forever core tier.
          </Typography>
          
          <DashboardMockup />
        </Stack>
      </Container>
    </Box>
  );
};
