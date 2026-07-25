import React from 'react';
import { Box, Typography } from '@mui/material';

export function ReferralProTip({ isFree }: { isFree: boolean }) {
  if (!isFree) return null;
  return (
    <Box sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 2, border: '1px solid', borderColor: 'primary.light' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
        🚀 Pro Tip: Upgrade to Creator Pro
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
        Upgrade before sharing your link to earn $10 in real statement credits AND 50 AI Credits per referral instead of just post quota!
      </Typography>
      <Typography variant="body1">
        <a href="/pricing" style={{ color: 'inherit', fontWeight: 'bold' }}>Upgrade Now &rarr;</a>
      </Typography>
    </Box>
  );
}
