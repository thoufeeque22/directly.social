import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { PricingTier } from './PricingCard';

export const AgencySection = ({ agencyTier }: { agencyTier: PricingTier | undefined }) => {
  if (!agencyTier) return null;

  return (
    <Box sx={{ textAlign: 'center', p: 4, borderRadius: 4, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        🏢 Managing multiple brands or clients?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Check out the {agencyTier.name} plan for Team Seats, Approvals, and White-Labeling.
      </Typography>
      <Button 
        disabled 
        variant="contained" 
        color="inherit"
        size="large" 
        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
      >
        {agencyTier.cta}
      </Button>
    </Box>
  );
};
