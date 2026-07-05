'use client';

import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { DocCategoryCard } from './DocCategoryCard';
import { BRAND } from '@/lib/core/brand';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const docCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'The quickest path to your first native post. Start here if you are new.',
    icon: <MenuBookIcon color="primary" sx={{ fontSize: 32 }} />,
    links: [
      { label: 'How to Login', href: '/docs/user/login-guide' },
      { label: 'Account Connection', href: '/docs/user/account-connection' },
      { label: 'Publishing Your First Video', href: '/docs/user/publishing-first-video' }
    ]
  },
  {
    id: 'core-features',
    title: 'Core Features',
    description: 'Master the tools that make directly.social powerful and efficient.',
    icon: <AutoAwesomeIcon color="primary" sx={{ fontSize: 32 }} />,
    links: [
      { label: 'Metadata Snippets', href: '/docs/user/metadata-snippets' },
      { label: 'AI Content Polish', href: '/docs/user/ai-content-polish' },
      { label: 'Media Management & Cloud Sync', href: '/docs/user/storage-setup' }
    ]
  },
  {
    id: 'technical-setup',
    title: 'Power Users Setup',
    description: 'Technical guides for advanced users configuring their own infrastructure.',
    icon: <EngineeringIcon color="primary" sx={{ fontSize: 32 }} />,
    links: [
      { label: 'AI Provider Keys (BYOK)', href: '/docs/dev/ai-byok-guide' },
      { label: 'Social Platform Keys (BYOK)', href: '/docs/dev/byok-guide' },
      { label: 'Cloud Storage Guide (BYOS)', href: '/docs/dev/vault-setup' }
    ]
  },
  {
    id: 'philosophy-support',
    title: 'Philosophy & Support',
    description: 'Understand our mission and how to get the most out of directly.social.',
    icon: <HelpCenterIcon color="primary" sx={{ fontSize: 32 }} />,
    links: [
      { label: 'The SaaS Tax Explained', href: '/philosophy' },
      { label: 'Why Native Matters', href: '/philosophy' },
      { label: 'Community & Feedback', href: 'mailto:support@directly.social' }
    ]
  }
];

export default function DocsClient() {
  return (
    <Box component="main" sx={{ flexGrow: 1, py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Documentation' }]} />
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

        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          {docCategories.map((cat, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <DocCategoryCard cat={cat} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
