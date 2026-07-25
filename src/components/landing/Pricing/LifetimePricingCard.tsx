import React, { useEffect, useState } from 'react';
import { Typography, Paper, Stack, Button, CircularProgress, Chip, Box, Skeleton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useCheckout } from './useCheckout';
import { PricingTier } from './PricingCard';

export const LifetimePricingCard = ({ tier }: { tier: PricingTier }) => {
  const { handleCheckout, isLoading } = useCheckout();
  const [licensesLeft, setLicensesLeft] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/pricing/lifetime-cap')
      .then(r => r.json())
      .then(data => {
        if (mounted && typeof data.count === 'number') {
          setLicensesLeft(data.count);
        }
      })
      .catch(console.error);
    return () => { mounted = false; };
  }, []);

  const handlePurchaseClick = () => {
    if (licensesLeft !== null && licensesLeft <= 0) {
      handleCheckout('5-year-deal');
    } else {
      handleCheckout(tier.id || '');
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>{tier.name}</Typography>
      <Stack direction="row" spacing={2} sx={{ my: 2, alignItems: 'baseline' }}>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>{tier.price}</Typography>
        <Typography variant="h5" color="text.disabled" sx={{ textDecoration: 'line-through', fontWeight: 600 }}>Actual price: $299</Typography>
      </Stack>
      
      <Box sx={{ mb: 2, minHeight: 72 }}>
        {licensesLeft !== null ? (
          <>
            <Chip
              label={licensesLeft > 0 ? `🔥 Only ${licensesLeft} licenses left` : 'Sold Out'}
              color={licensesLeft > 0 ? 'warning' : 'default'}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
            <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 600 }}>
              Once sold out, the $89 deal will only cover a 5-year license instead of a Lifetime license.
            </Typography>
          </>
        ) : (
          <>
            <Skeleton variant="rounded" height={24} width={150} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} width="80%" />
          </>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{tier.description}</Typography>
      
      <Stack spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
        {tier.features.map((f: string, i: number) => (
          <Stack direction="row" spacing={1.5} key={i}>
            <CheckIcon color="primary" fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{f}</Typography>
          </Stack>
        ))}
      </Stack>
      <Button 
        variant="outlined" 
        color="primary" 
        size="large" 
        onClick={handlePurchaseClick}
        disabled={isLoading === tier.id || isLoading === '5-year-deal'}
        fullWidth
        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
      >
        {(isLoading === tier.id || isLoading === '5-year-deal') ? <CircularProgress size={24} color="inherit" /> : (licensesLeft !== null && licensesLeft <= 0 ? "Get 5-Year Deal" : tier.cta)}
      </Button>
    </Paper>
  );
};
