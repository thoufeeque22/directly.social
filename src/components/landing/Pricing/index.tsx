'use client';

import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { PricingCard } from './PricingCard';
import { pricingTiers } from '../data';

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
          {pricingTiers.map((tier, index) => (
            <Grid size={{ xs: 12, md: 5 }} key={index}>
              <PricingCard tier={tier} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
