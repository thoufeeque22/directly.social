import React from 'react';
import { Metadata } from 'next';
import { Typography, Paper } from '@mui/material';
import { LegalPageWrapper } from '@/components/legal/LegalPageWrapper';
import { TermsContent } from '@/components/legal/TermsContent';

import { BRAND } from '@/lib/core/brand';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for ${BRAND.name}.`,
};

export default function TermsOfService() {
  return (
    <LegalPageWrapper title="Terms of Service">
      <Paper sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>Terms of Service</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>Last Updated: June 13, 2026</Typography>
        <TermsContent />
      </Paper>
    </LegalPageWrapper>
  );
}
