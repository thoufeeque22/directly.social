import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';

interface Props {
  history: Array<{ email: string; status: string }>;
}

export const ReferralSquad: React.FC<Props> = ({ history }) => {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        Your Squad
      </Typography>
      {history.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default', borderRadius: 2 }}>
          No referrals yet. Share your link to get started!
        </Typography>
      ) : (
        <Stack spacing={1} data-testid="squad-list">
          {history.map((row, i) => (
            <Paper key={i} variant="outlined" sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.email}</Typography>
              <Box sx={{ 
                px: 1.5, py: 0.5, borderRadius: 4, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                bgcolor: row.status === 'Active' ? 'rgba(76,175,80,0.1)' : row.status === 'Churned' ? 'rgba(244,67,54,0.1)' : 'rgba(158,158,158,0.1)',
                color: row.status === 'Active' ? 'success.main' : row.status === 'Churned' ? 'error.main' : 'text.secondary'
              }}>
                {row.status}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};
