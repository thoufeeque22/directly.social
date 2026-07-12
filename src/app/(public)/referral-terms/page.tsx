import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { ReferralTermsContent } from '@/components/legal/ReferralTermsContent';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata = {
  title: 'Referral Program Terms',
};

export default function ReferralTermsPage() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Referral Program Terms' }]} />
        <Paper sx={{ p: { xs: 4, md: 8 }, borderRadius: 4, bgcolor: 'background.paper', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
            Referral Program Terms
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
          <ReferralTermsContent />
        </Paper>
      </Container>
    </Box>
  );
}
