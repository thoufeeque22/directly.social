'use client';

import React from 'react';
import { Box, Typography, Container, Paper, Stack, Button } from '@mui/material';
import Link from 'next/link';
import KeyIcon from '@mui/icons-material/VpnKey';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { BRAND } from '@/lib/core/brand';
import { Header } from '@/components/layout/Header';

export default function ByokPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header onToggleSidebar={() => {}} tierName="Public" />
      
      <Box 
        sx={{ 
          pt: { xs: 12, md: 20 }, 
          pb: { xs: 10, md: 15 },
          background: 'linear-gradient(135deg, rgba(255,107,107,0.05) 0%, rgba(255,142,83,0.05) 100%)',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <KeyIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 900, 
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              The Ultimate AI Freedom: Bring Your Own Key
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '800px', lineHeight: 1.6, fontWeight: 400 }}>
              Stop paying a massive markup for AI generation. Plug your own OpenAI or Anthropic API key into {BRAND.name} and unlock infinite scalability at wholesale prices.
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
              <Button 
                component={Link} 
                href="/referral"
                variant="contained" 
                size="large"
                sx={{ 
                  py: 1.5, px: 4, 
                  borderRadius: 8, 
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                  boxShadow: '0 8px 16px rgba(255,107,107,0.25)',
                  '&:hover': {
                    boxShadow: '0 12px 24px rgba(255,107,107,0.35)',
                  }
                }}
              >
                Unlock via 5 Referrals
              </Button>
              <Button 
                component={Link} 
                href="/pricing"
                variant="outlined" 
                size="large"
                sx={{ 
                  py: 1.5, px: 4, 
                  borderRadius: 8, 
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 }
                }}
              >
                Buy Lifetime Deal
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 15 } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -3, alignItems: 'center' }}>
          <Box sx={{ width: { xs: '100%', md: '50%' }, px: 3, mb: { xs: 4, md: 0 } }}>
            <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
              The Problem
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 3 }}>
              The SaaS AI Markup Trap
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Standard SaaS platforms act as middlemen between you and AI providers like OpenAI. They buy AI generations for pennies, mark them up by 1,000%, and force you into expensive monthly subscriptions with artificial "credit limits." <br/><br/>
              When you hit your limit, you are blocked from working until you upgrade. You are paying for their profit margins, not the AI.
            </Typography>
          </Box>
          <Box sx={{ width: { xs: '100%', md: '50%' }, px: 3 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" color="success.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
                The Solution
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, mb: 3 }}>
                BYOK Architecture
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                With a <strong>Lifetime BYOK License</strong>, {BRAND.name} gets out of your way. You supply your own API key directly into your dashboard. <br/><br/>
                We pass your requests directly to the AI provider. You pay them exactly their wholesale API cost (which is virtually zero), and you pay us absolutely nothing for generation.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>

      <Box sx={{ bgcolor: 'action.hover', py: { xs: 10, md: 15 }, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 8 }}>
            Why Professionals Choose BYOK
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            <Box sx={{ width: { xs: '100%', md: '33.333333%' }, px: 2, mb: { xs: 4, md: 0 } }}>
              <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px)' } }}>
                <MoneyOffIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Zero Markups
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Pay wholesale API prices. Generate hundreds of posts, threads, and captions for literal pennies a day. No middleman taxes.
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '33.333333%' }, px: 2, mb: { xs: 4, md: 0 } }}>
              <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px)' } }}>
                <AllInclusiveIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Infinite Generation
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Never get blocked by a "monthly limit" or "insufficient credits" modal again. Scale your content engine as aggressively as you want.
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '33.333333%' }, px: 2 }}>
              <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px)' } }}>
                <VpnLockIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Complete Privacy
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Your data stays yours. Because your API key is used, your data goes straight to OpenAI's private API layer. We don't intercept, store, or train on your prompts.
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}
