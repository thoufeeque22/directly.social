import React from 'react';
import { Box, Typography, Grid, Paper, Stack, Button, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useCheckout } from './useCheckout';
import { PricingTier } from './PricingCard';

export const PowerUserSection = ({ lifetimeTier, hackerTier }: { lifetimeTier: PricingTier | undefined; hackerTier: PricingTier | undefined }) => {
  const { handleCheckout, isLoading } = useCheckout();

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
                <Typography variant="h5" color="text.disabled" sx={{ textDecoration: 'line-through', fontWeight: 600 }}>$299</Typography>
              </Stack>
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
                disabled={isLoading === lifetimeTier.id}
                fullWidth
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
              >
                {isLoading === lifetimeTier.id ? <CircularProgress size={24} color="inherit" /> : lifetimeTier.cta}
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
