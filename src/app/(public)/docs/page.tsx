'use client';

import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { DocCategoryCard } from './DocCategoryCard';
import { BRAND } from '@/lib/core/brand';

const docCategories = [
  {
    id: 'user-guides',
    title: 'User Guides',
    description: 'Learn how to use Directly Social to manage your content and grow your reach.',
    icon: <MenuBookIcon color="primary" sx={{ fontSize: 32 }} />,
    links: [
      { label: 'Video Storage Setup', href: '/docs/user/storage-setup' },
      { label: 'Account Connection', href: '/docs/user/account-connection' },
      { label: 'Publishing Your First Video', href: '/docs/user/publishing-first-video' }
    ]
  },
  {
    id: 'technical-setup',
    title: 'Power Users Setup',
    description: 'Technical guides for advanced users and power users configuring their own infrastructure.',
    icon: <EngineeringIcon color="primary" sx={{ fontSize: 32 }} />,
    links: [
      { label: 'Storage Vault (BYOS)', href: '/docs/dev/vault-setup' },
      { label: 'Bring Your Own Key (BYOK)', href: '/docs/dev/byok-guide' },
      { label: 'Meta API Configuration', href: '/docs/dev/meta-guide' }
    ]
  },
  {
    id: 'philosophy',
    title: 'Philosophy',
    description: 'Understand why we built Directly Social and how it helps you.',
    icon: <HelpCenterIcon color="primary" sx={{ fontSize: 32 }} />,
    links: [
      { label: 'Why Native Matters', href: '/philosophy' },
      { label: 'Algorithmic Boost', href: '/philosophy' },
      { label: 'Community & Support', href: '/docs/user/account-connection' }
    ]
  }
];

export default function DocsPage() {
  return (
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
  );
}
