'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Grid, Paper, useTheme } from '@mui/material';
import { LandingHeader } from '@/components/landing/Header';
import { LandingFooter } from '@/components/landing/Footer';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Link from 'next/link';

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
      { label: 'TikTok API Key Guide', href: '/docs/byok-guide' },
      { label: 'Meta Developer Portal', href: 'https://developers.facebook.com/' },
      { label: 'YouTube OAuth Setup', href: '/docs/byok-guide' }
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
  const theme = useTheme();

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
              Everything you need to know about Directly Social. From initial setup to mastering Native Publishing.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {docCategories.map((cat, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Paper 
                  id={cat.id}
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    height: '100%', 
                    borderRadius: 3, 
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: 'background.paper',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                >
                  <Box sx={{ mb: 2 }}>{cat.icon}</Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>{cat.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {cat.description}
                  </Typography>
                  <Stack spacing={1.5}>
                    {cat.links.map((link, i) => (
                      <Typography 
                        key={i} 
                        component={Link}
                        href={link.href}
                        variant="body2" 
                        sx={{ 
                          color: 'primary.main', 
                          fontWeight: 600, 
                          textDecoration: 'none',
                          display: 'block',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {link.label} →
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <LandingFooter />
    </Box>
  );
}
