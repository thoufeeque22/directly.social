import React from 'react';
import { Metadata } from 'next';
import { Typography, Paper, Container, Box } from '@mui/material';
import { PrivacyContent } from '@/components/legal/PrivacyContent';

import { BRAND } from '@/lib/core/brand';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy and Google API Disclosure for ${BRAND.name}.`,
  alternates: { canonical: `${BRAND.url}/privacy` },
  openGraph: {
    title: 'Privacy Policy',
    description: `Privacy Policy and Google API Disclosure for ${BRAND.name}.`,
    url: `${BRAND.url}/privacy`,
    siteName: BRAND.name,
    images: [{ url: `${BRAND.url}/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy',
    description: `Privacy Policy and Google API Disclosure for ${BRAND.name}.`,
    images: [`${BRAND.url}/og-image.png`],
  },
};

export default function PrivacyPolicy() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Privacy Policy' }]} />
        <Paper sx={{ p: { xs: 4, md: 8 }, borderRadius: 4, bgcolor: 'background.paper', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>Privacy Policy</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Last Updated: June 13, 2026</Typography>
          <PrivacyContent />
        </Paper>
      </Container>
    </Box>
  );
}
