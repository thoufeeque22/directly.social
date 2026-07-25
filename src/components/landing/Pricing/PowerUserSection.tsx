import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { PricingTier } from './PricingCard';
import { LifetimePricingCard } from './LifetimePricingCard';
import { HackerPricingCard } from './HackerPricingCard';

export const PowerUserSection = ({ lifetimeTier, hackerTier }: { lifetimeTier: PricingTier | undefined; hackerTier: PricingTier | undefined }) => {
  return (
    <Box sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
        Power User? We&apos;ve got you covered.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
        Escape the SaaS tax entirely. Bring your own infrastructure and own your workflow.
      </Typography>
      
      <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
        {lifetimeTier && (
          <Grid size={{ xs: 12, sm: 6, md: 5 }}>
            <LifetimePricingCard tier={lifetimeTier} />
          </Grid>
        )}

        {hackerTier && (
          <Grid size={{ xs: 12, sm: 6, md: 5 }}>
            <HackerPricingCard tier={hackerTier} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
