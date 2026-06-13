import React from 'react';
import { Typography, Paper } from '@mui/material';
import { LegalPageWrapper } from '@/components/legal/LegalPageWrapper';
import { TermsContent } from '@/components/legal/TermsContent';

export const metadata = {
  title: 'Terms of Service | Directly Social',
  description: 'Terms of Service for Directly Social.',
};

export default function TermsOfService() {
  return (
    <LegalPageWrapper title="Terms of Service">
      <Paper sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
        <Typography variant="h3" gutterBottom fontWeight={800}>Terms of Service</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>Last Updated: June 13, 2026</Typography>
        <TermsContent />
      </Paper>
    </LegalPageWrapper>
  );
}
