'use client';

import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { LandingHeader } from '@/components/landing/Header';
import { LandingFooter } from '@/components/landing/Footer';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { DocCategoryCard } from './DocCategoryCard';
import { BRAND } from '@/lib/core/brand';

const docCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn how to set up your local vault and connect your first social account.',
    icon: <MenuBookIcon color="primary" sx={{ fontSize: 32 }} />,
    links: [
      { label: 'Local Vault Setup', href: '/docs/vault-setup' },
      { label: 'Account Connection', href: '/docs/account-connection' },
      { label: 'Publishing Your First Video', href: '/docs/publishing-first-video' }
    ]
  },
  {
    id: 'configuration-byok',
    title: 'Configuration (BYOK)',
    description: 'Detailed guides on bringing your own API keys for TikTok, Instagram, and YouTube.',
    icon: <SettingsSuggestIcon color="primary" sx={{ fontSize: 32 }} />,
    links: [
      { label: 'TikTok API Configuration', href: '/docs/byok-guide' },
      { label: 'Meta API Configuration', href: '/docs/meta-guide' },
      { label: 'YouTube API Configuration', href: '/docs/byok-guide' }
    ]
  },
  {
    id: 'philosophy',
    title: 'Philosophy & Reach',
    description: 'Understand the "SaaS Tax" and how Native Publishing boosts your algorithmic reach.',
    icon: <HelpCenterIcon color="primary" sx={{ fontSize: 32 }} />,
    links: [
      { label: 'The SaaS Tax Explained', href: '/philosophy' },
      { label: 'Why Native Matters', href: '/philosophy' },
      { label: 'Algorithmic Boost', href: '/philosophy' }
    ]
  }
];

export default function DocsPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LandingHeader />
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant="overline" color="primary" sx={{ letterSpacing: '0.1em', fontWeight: 700 }}>
              Documentation
            </Typography>
            <Typography variant="h2" sx={{ mt: 2, mb: 3, fontWeight: 800 }}>
              Help Center & Guides
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Everything you need to know about {BRAND.name}. From initial setup to mastering Native Publishing.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {docCategories.map((cat, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <DocCategoryCard cat={cat} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <LandingFooter />
    </Box>
  );
}
