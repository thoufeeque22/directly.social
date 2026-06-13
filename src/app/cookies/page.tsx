import React from 'react';
import { Typography, Paper } from '@mui/material';
import { LegalPageWrapper } from '@/components/legal/LegalPageWrapper';
import { CookieContent } from '@/components/legal/CookieContent';

export const metadata = {
  title: 'Cookie Policy | Directly Social',
  description: 'Cookie Policy for Directly Social.',
};

export default function CookiePolicy() {
  return (
    <LegalPageWrapper title="Cookie Policy">
      <Paper sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>Cookie Policy</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>Last Updated: June 13, 2026</Typography>
        <CookieContent />
      </Paper>
    </LegalPageWrapper>
  );
}
