
'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';

interface MediaLibraryEmptyStateProps {
  searchQuery?: string;
  onUpload?: () => void;
}

export const MediaLibraryEmptyState: React.FC<MediaLibraryEmptyStateProps> = ({
  searchQuery,
  onUpload,
}) => {
  return (
    <Box
      sx={{
        gridColumn: '1 / -1',
        py: '2rem',
        px: '1rem',
        textAlign: 'center',
        color: 'text.secondary',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box>
        <MovieIcon sx={{ fontSize: 48, opacity: 0.5 }} />
      </Box>
      {searchQuery ? (
        <Typography>No matching videos found.</Typography>
      ) : (
        <>
          <Typography variant="h6">Your media library is empty.</Typography>
          <Typography>Upload your first asset to get started.</Typography>
          <Button variant="contained" color="primary" onClick={onUpload}>
            Upload
          </Button>
        </>
      )}
    </Box>
  );
};
