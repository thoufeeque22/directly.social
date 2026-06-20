'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';

export const ByosGalleryPlaceholder: React.FC = () => (
  <Paper elevation={0} sx={{ p: '1.5rem', borderRadius: '12px' }}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
        textAlign: 'center',
      }}
    >
      <CloudQueueIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
      <Typography variant="h6" color="text.secondary">
        My Cloud — Coming Soon
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
        Browse and re-use all videos in your connected storage bucket, including files uploaded outside the app.
      </Typography>
    </Box>
  </Paper>
);
