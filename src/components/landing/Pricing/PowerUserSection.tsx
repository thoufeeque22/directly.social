import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Stack, Button, CircularProgress, Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useCheckout } from './useCheckout';
import { PricingTier } from './PricingCard';
import { getLifetimeLicensesLeft } from '@/app/actions/pricing';

export const PowerUserSection = ({ lifetimeTier, hackerTier }: { lifetimeTier: PricingTier | undefined; hackerTier: PricingTier | undefined }) => {
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
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{lifetimeTier.name}</Typography>
              <Stack direction="row" spacing={2} sx={{ my: 2, alignItems: 'baseline' }}>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>{lifetimeTier.price}</Typography>
                <Typography variant="h5" color="text.disabled" sx={{ textDecoration: 'line-through', fontWeight: 600 }}>Actual price: $299</Typography>
              </Stack>
              {licensesLeft !== null && (
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={licensesLeft > 0 ? `🔥 Only ${licensesLeft} licenses left` : 'Sold Out'}
                    color={licensesLeft > 0 ? 'warning' : 'default'}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                  <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 600 }}>
                    Once sold out, the $89 deal will only cover a 5-year license instead of a Lifetime license.
                  </Typography>
                </Box>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{lifetimeTier.description}</Typography>
              
              <Stack spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
                {lifetimeTier.features.map((f: string, i: number) => (
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
                onClick={() => handleCheckout(lifetimeTier.id || '')}
                disabled={isLoading === lifetimeTier.id || licensesLeft === 0}
                fullWidth
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
              >
                {isLoading === lifetimeTier.id ? <CircularProgress size={24} color="inherit" /> : (licensesLeft === 0 ? "Sold Out" : lifetimeTier.cta)}
              </Button>
            </Paper>
          </Grid>
        )}

        {hackerTier && (
          <Grid size={{ xs: 12, sm: 6, md: 5 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{hackerTier.name}</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, my: 2 }}>{hackerTier.price}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{hackerTier.description}</Typography>
              
              <Stack spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
                {hackerTier.features.map((f: string, i: number) => (
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
                onClick={() => handleCheckout(hackerTier.id || '')}
                disabled={isLoading === hackerTier.id}
                fullWidth
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, border: '1px dashed', borderColor: 'divider' }}
              >
                {isLoading === hackerTier.id ? <CircularProgress size={24} color="inherit" /> : hackerTier.cta}
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
