import React from 'react';
import { Typography, Paper } from '@mui/material';
import { LegalPageWrapper } from '@/components/legal/LegalPageWrapper';
import { PrivacyContent } from '@/components/legal/PrivacyContent';

export const metadata = {
  title: 'Privacy Policy | Directly Social',
  description: 'Privacy Policy and Google API Disclosure for Directly Social.',
};

export default function PrivacyPolicy() {
  return (
    <LegalPageWrapper title="Privacy Policy">
      <Paper sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>Privacy Policy</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>Last Updated: June 13, 2026</Typography>
        <PrivacyContent />
      </Paper>
    </LegalPageWrapper>
  );
}
