/* eslint-disable max-lines */
'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Stack, Chip, CircularProgress } from '@mui/material';
import { PricingCard } from './PricingCard';
import { pricingTiers } from '../data';
import CheckIcon from '@mui/icons-material/Check';
import { useCheckout } from './useCheckout';

export const Pricing = () => {
  const coreTiers = pricingTiers.filter(t => ['free-starter', 'creator-pro', 'cloud-pro'].includes(t.id));
  const powerPass = pricingTiers.find(t => t.id === 'power-pass');
  const lifetimeTier = pricingTiers.find(t => t.id === 'lifetime-deal');
  const hackerTier = pricingTiers.find(t => t.id === 'free-hacker');
  const agencyTier = pricingTiers.find(t => t.id === 'agency-pro');

  const { handleCheckout, isLoading } = useCheckout();

  return (
    <Box id="pricing" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip 
            label="🎉 Early Bird Launch Pricing: 50% off for first 1,000 users. Lock in your rate forever." 
            color="primary" 
            variant="outlined"
            sx={{ mb: 3, fontWeight: 700, borderWidth: 2 }} 
          />
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 3 }}>
            Simple, Honest Pricing
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 750, mx: 'auto', fontWeight: 400 }}>
            No hidden fees. No middleman markup. Select the plan that fits your workflow.
          </Typography>
        </Box>

        {powerPass && (
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, md: 3 }, 
                borderRadius: 4, 
                bgcolor: 'primary.50',
                border: '1px solid',
                borderColor: 'primary.200',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 3
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.900' }}>
                ⚡ Just need to schedule a batch today? Get a 24-Hour Power Pass for {powerPass.price}.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="small"
                onClick={() => handleCheckout(powerPass.id)}
                disabled={isLoading === powerPass.id}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}
              >
                {isLoading === powerPass.id ? <CircularProgress size={20} color="inherit" /> : powerPass.cta}
              </Button>
            </Paper>
          </Box>
        )}

        <Grid container spacing={4} sx={{ justifyContent: 'center', mb: 10 }}>
          {coreTiers.map((tier, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <PricingCard tier={tier} />
            </Grid>
          ))}
        </Grid>

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
                    {lifetimeTier.features.map((f, i) => (
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
                    onClick={() => handleCheckout(lifetimeTier.id)}
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
                    {hackerTier.features.map((f, i) => (
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
                    onClick={() => handleCheckout(hackerTier.id)}
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

        {agencyTier && (
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
        )}

      </Container>
    </Box>
  );
};
