import React from 'react';
import { Typography, Paper, Stack, Button, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useCheckout } from './useCheckout';
import { PricingTier } from './PricingCard';

export const HackerPricingCard = ({ tier }: { tier: PricingTier }) => {
  const { handleCheckout, isLoading } = useCheckout();

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>{tier.name}</Typography>
      <Typography variant="h3" sx={{ fontWeight: 800, my: 2 }}>{tier.price}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{tier.description}</Typography>
      
      <Stack spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
        {tier.features.map((f: string, i: number) => (
          <Stack direction="row" spacing={1.5} key={i}>
            <CheckIcon color="inherit" fontSize="small" sx={{ opacity: 0.6 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{f}</Typography>
          </Stack>
        ))}
      </Stack>
      <Button 
        variant="text" 
        color="inherit"
        size="large" 
        onClick={() => handleCheckout(tier.id || '')}
        disabled={isLoading === tier.id}
        fullWidth
        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, border: '1px dashed', borderColor: 'divider' }}
      >
        {isLoading === tier.id ? <CircularProgress size={24} color="inherit" /> : tier.cta}
      </Button>
    </Paper>
  );
};
