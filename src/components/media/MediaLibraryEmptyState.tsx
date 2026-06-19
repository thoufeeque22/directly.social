
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';

interface MediaLibraryEmptyStateProps {
  searchQuery?: string;
}

export const MediaLibraryEmptyState: React.FC<MediaLibraryEmptyStateProps> = ({
  searchQuery,
}) => {
  return (
    <Box
      sx={{
        gridColumn: '1 / -1',
        p: '4rem',
        textAlign: 'center',
        color: 'text.secondary',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <MovieIcon sx={{ fontSize: 48, opacity: 0.5 }} />
      </Box>
      <Typography>
        {searchQuery
          ? 'No matching videos found.'
          : 'Your media library is empty. Upload a video to get started!'}
      </Typography>
    </Box>
  );
};
