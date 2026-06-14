'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Paper, Stack, useTheme } from '@mui/material';
import { LandingHeader } from '@/components/landing/Header';
import { LandingFooter } from '@/components/landing/Footer';
import GppGoodIcon from '@mui/icons-material/GppGood';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { BRAND } from '@/lib/core/brand';

const philosophyPoints = [
  {
    title: 'The Middleman Tax',
    problem: 'SaaS tools force you to upload your videos to their servers. They own your files, track your data, and add latency to every post.',
    solution: <><strong>{BRAND.name}</strong> supports Bring Your Own Storage (BYOS). Connect your own S3 bucket or local drive. Your videos never touch our servers.</>,
    icon: <NoEncryptionIcon color="primary" sx={{ fontSize: 40 }} />
  },
  {
    title: 'The Channel Tax',
    problem: 'Competitors charge you per social account or "seat." If you have multiple brands, you hit a $100/mo paywall instantly.',
    solution: 'Since you Bring Your Own Key (BYOK), we don\'t pay for your usage. We offer unlimited accounts for free in our core tier.',
    icon: <MonetizationOnIcon color="primary" sx={{ fontSize: 40 }} />
  },
  {
    title: 'The AI Markup Tax',
    problem: 'Other tools resell AI credits at a 300% markup. You pay for "Pro" tiers just to generate captions that cost them fractions of a cent.',
    solution: 'Plug in your own Gemini or OpenAI key. Pay the raw wholesale price directly to the provider. No markup from us.',
    icon: <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />
  },
  {
    title: 'The Algorithmic Tax',
    problem: 'Platforms often suppress reach for "Cloud Schedulers." They want "Native" content from real devices.',
    solution: 'Our Native Proxy-Push makes your automated posts look 100% manual to TikTok and Instagram algorithms.',
    icon: <GppGoodIcon color="primary" sx={{ fontSize: 40 }} />
  }
];

export default function PhilosophyPage() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LandingHeader />
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 10, textAlign: 'center' }}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: '0.2em' }}>
              Our Philosophy
            </Typography>
            <Typography variant="h2" sx={{ mt: 2, mb: 3, fontWeight: 800 }}>
              Pro Tools. No SaaS Tax.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 850, mx: 'auto', fontWeight: 400 }}>
              We believe social media management should be a <strong>Studio Tool</strong> (like VS Code or Photoshop), not a &quot;Middleman Service.&quot; Here is why <strong>{BRAND.name}</strong> is built differently.
            </Typography>
          </Box>

          <Stack spacing={6}>
            {philosophyPoints.map((point, index) => (
              <Paper 
                key={index}
                elevation={0}
                sx={{ 
                  p: { xs: 4, md: 6 }, 
                  borderRadius: 4, 
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Grid container spacing={6} sx={{ alignItems: 'center' }}>
                  <Grid size={{ xs: 12, md: 2 }} sx={{ textAlign: 'center' }}>
                    {point.icon}
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'error.main', textTransform: 'uppercase', letterSpacing: 1 }}>The Problem</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>{point.title}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {point.problem}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'success.main', textTransform: 'uppercase', letterSpacing: 1 }}>The Solution</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.7 }}>
                      {point.solution}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>
      <LandingFooter />
    </Box>
  );
}
