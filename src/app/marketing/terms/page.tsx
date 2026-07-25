import React from 'react';
import { Metadata } from 'next';
import { Typography, Paper, Container, Box } from '@mui/material';
import { TermsContent } from '@/components/legal/TermsContent';

import { BRAND } from '@/lib/core/brand';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for ${BRAND.name}.`,
  alternates: { canonical: `${BRAND.url}/terms` },
  openGraph: {
    title: 'Terms of Service',
    description: `Terms of Service for ${BRAND.name}.`,
    url: `${BRAND.url}/terms`,
    siteName: BRAND.name,
    images: [{ url: `${BRAND.url}/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service',
    description: `Terms of Service for ${BRAND.name}.`,
    images: [`${BRAND.url}/og-image.png`],
  },
};

export default function TermsOfService() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Terms of Service' }]} />
        <Paper sx={{ p: { xs: 4, md: 8 }, borderRadius: 4, bgcolor: 'background.paper', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>Terms of Service</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Last Updated: June 13, 2026</Typography>
          <TermsContent />
        </Paper>
      </Container>
    </Box>
  );
}
