'use client';

import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const StatItem = ({ icon, label, color, progress, delay }: { icon: React.ReactNode, label: string, color: string, progress: string, delay: number }) => (
  <Stack direction="row" spacing={2} sx={{ width: '100%', mb: 1, alignItems: 'center' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 24 }}>{icon}</Box>
    <Typography variant="caption" sx={{ minWidth: 60, fontWeight: 600, fontSize: '0.7rem' }}>{label}</Typography>
    <Box sx={{ flexGrow: 1, height: 6, bgcolor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
      <Box 
        component={motion.div}
        initial={{ width: '0%' }}
        animate={{ width: progress }}
        transition={{ duration: 1.5, delay, ease: "easeOut" }}
        sx={{ height: '100%', bgcolor: color, borderRadius: 3 }} 
      />
    </Box>
    <Box 
      component={motion.div}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: delay + 1.2 }}
    >
      <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main', display: 'flex' }} />
    </Box>
  </Stack>
);
