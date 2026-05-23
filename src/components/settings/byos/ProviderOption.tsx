import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';

interface Props {
  active: boolean; onClick: () => void; icon: React.ReactNode; title: string; description: string;
}

export const ProviderOption = ({ active, onClick, icon, title, description }: Props) => (
  <Paper variant="outlined" onClick={onClick}
    sx={{ p: 3, cursor: 'pointer', borderRadius: 3, borderColor: active ? 'primary.main' : 'divider', backgroundColor: active ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent', transition: 'all 0.3s ease', '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' } }}>
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      {icon}
      <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" align="center">{description}</Typography>
    </Stack>
  </Paper>
);
