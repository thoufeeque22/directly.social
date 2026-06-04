'use client';

import React from 'react';
import { Box, Paper, Stack, useTheme } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import InstagramIcon from '@mui/icons-material/Instagram';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StatItem = ({ icon, color, progress }: { icon: React.ReactNode, color: string, progress: string }) => (
  <Stack direction="row" spacing={2} sx={{ width: '100%', mb: 1, alignItems: 'center' }}>
    {icon}
    <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'divider', borderRadius: 4, overflow: 'hidden' }}>
      <Box sx={{ width: progress, height: '100%', bgcolor: color }} />
    </Box>
    <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
  </Stack>
);

export const DashboardMockup = () => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={24}
      sx={{
        width: '100%',
        maxWidth: 900,
        mt: 6,
        mx: 'auto',
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ bgcolor: 'action.hover', px: 2, py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Stack direction="row" spacing={1}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f56' }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27c93f' }} />
        </Stack>
      </Box>
      
      <Box sx={{ display: 'flex', height: 400 }}>
        <Box sx={{ width: { xs: 60, md: 200 }, bgcolor: 'action.hover', borderRight: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Stack spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ height: 12, bgcolor: 'divider', borderRadius: 1, width: i % 2 === 0 ? '80%' : '60%' }} />
            ))}
          </Stack>
        </Box>
        
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, bgcolor: 'background.default' }}>
          <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 4, alignItems: 'center' }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'primary.main' }} />
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ height: 16, bgcolor: 'divider', borderRadius: 1, width: '40%', mb: 1 }} />
                <Box sx={{ height: 12, bgcolor: 'divider', borderRadius: 1, width: '20%' }} />
              </Box>
              <Box sx={{ px: 1.5, py: 0.5, borderRadius: 1, border: '1px solid', borderColor: 'error.main', color: 'error.main', fontSize: 10, sx: { fontWeight: 700 } }}>
                LIVE
              </Box>
            </Stack>
            
            <StatItem icon={<YouTubeIcon sx={{ color: '#FF0000' }} />} color="#FF0000" progress="60%" />
            <StatItem icon={<MusicNoteIcon sx={{ color: '#00F2EA' }} />} color="#00F2EA" progress="85%" />
            <StatItem icon={<InstagramIcon sx={{ color: '#E1306C' }} />} color="#E1306C" progress="45%" />
          </Paper>
        </Box>
      </Box>
    </Paper>
  );
};
