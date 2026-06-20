
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface MediaLibraryHeaderProps {
  actions?: React.ReactNode;
}

export const MediaLibraryHeader: React.FC<MediaLibraryHeaderProps> = ({
  actions,
}) => {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: '-2rem',
        zIndex: 100,
        bgcolor: 'rgba(var(--background-rgb), 0.8)',
        backdropFilter: 'blur(16px)',
        padding: '1.5rem 2rem',
        margin: '0 -2rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Media Gallery
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your staged video assets and reuse them across platforms.
        </Typography>
      </Box>
      {actions}
    </Box>
  );
};
