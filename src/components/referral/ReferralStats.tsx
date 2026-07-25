import React from 'react';
import { Typography, Stack, Paper } from '@mui/material';

interface Props {
  isFree: boolean;
  quotaRemaining: number;
  aiCredits: number;
  earnedFreeMonths: number;
}

export function ReferralStats({ isFree, quotaRemaining, aiCredits, earnedFreeMonths }: Props) {
  return (
    <Stack direction="row" spacing={2}>
      <Paper variant="outlined" sx={{ flex: 1, p: 2, borderRadius: 2, textAlign: 'center', bgcolor: 'rgba(255,142,83,0.05)' }}>
        <Typography variant="h3" color="#FF6B6B" data-testid="extra-posts-quota" sx={{ fontWeight: 800 }}>
          +{isFree ? quotaRemaining : aiCredits}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {isFree ? 'Extra Free Posts' : 'AI Credits Earned'}
        </Typography>
      </Paper>

      <Paper variant="outlined" sx={{ flex: 1, p: 2, borderRadius: 2, textAlign: 'center', bgcolor: 'rgba(76,175,80,0.05)' }}>
        <Typography variant="h3" color="success.main" data-testid="earned-free-months" sx={{ fontWeight: 800 }}>
          {earnedFreeMonths}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Earned Free Months
        </Typography>
      </Paper>
    </Stack>
  );
}
