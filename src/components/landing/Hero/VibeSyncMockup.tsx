'use client';

import React from 'react';
import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

export const VibeSyncMockup = () => {
  const theme = useTheme();
  
  return (
    <Paper elevation={0} sx={{ width: 200, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, bgcolor: 'background.paper', display: { xs: 'none', md: 'block' } }}>
      <Typography variant="caption" sx={{ fontWeight: 700, mb: 2, display: 'block' }}>Vibe Sync AI</Typography>
      <Box sx={{ height: 100, bgcolor: 'action.hover', borderRadius: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed', borderColor: 'divider', overflow: 'hidden', position: 'relative' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem', zIndex: 1 }}>VIDEO_PREVIEW.mp4</Typography>
        <Box 
          component={motion.div}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, hsla(var(--primary), 0.1), transparent)' }}
        />
      </Box>
      <Stack spacing={1}>
        <Box sx={{ height: 6, bgcolor: 'primary.main', opacity: 0.4, borderRadius: 1, width: '100%' }} />
        <Box sx={{ height: 6, bgcolor: 'primary.main', opacity: 0.2, borderRadius: 1, width: '80%' }} />
        <Box sx={{ height: 6, bgcolor: 'primary.main', opacity: 0.1, borderRadius: 1, width: '90%' }} />
      </Stack>
    </Paper>
  );
};
