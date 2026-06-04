'use client';

import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { PricingCard } from './PricingCard';

const tiers = [
  {
    name: 'Local Core',
    price: '$0',
    description: 'Perfect for solo creators who value privacy and control.',
    features: [
      'Unlimited Local Projects',
      'By-Your-Own-Key (BYOK)',
      'Native API Distribution',
      'AI Vibe Sync (Local)',
      'Community Support'
    ],
    cta: 'Get Started',
    highlighted: true
  },
  {
    name: 'Cloud Pro',
    price: '$15',
    period: '/mo',
    description: 'For power users who need sync and team collaboration.',
    features: [
      'Everything in Local Core',
      'Cloud Backup & Sync',
      'Team Shared Vaults',
      'Priority Support',
      'Managed AI Endpoints'
    ],
    cta: 'Coming Soon',
    disabled: true
  }
];

export const Pricing = () => {
  return (
    <Box id="pricing" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
            Simple, Honest Pricing
          </Typography>
          <Typography variant="h6" color="text.secondary">
            No hidden fees. No middleman markup.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          {tiers.map((tier, index) => (
            <Grid size={{ xs: 12, md: 5 }} key={index}>
              <PricingCard tier={tier} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
