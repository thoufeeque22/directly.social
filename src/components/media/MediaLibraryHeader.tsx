
'use client';

import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';

interface MediaLibraryHeaderProps {
  onAddVideo: () => void;
  onClearAll: () => void;
  isUploading: boolean;
  hasAssets: boolean;
}

export const MediaLibraryHeader: React.FC<MediaLibraryHeaderProps> = ({
  onAddVideo,
  onClearAll,
  isUploading,
  hasAssets,
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
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={18} />}
          onClick={onAddVideo}
          disabled={isUploading}
          data-testid="header-upload-button"
          sx={{
            fontWeight: 'bold',
            boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}4D`,
          }}
        >
          Upload
        </Button>
        {hasAssets && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<Trash2 size={16} />}
            onClick={onClearAll}
            disabled={isUploading}
            data-testid="clear-gallery"
          >
            Clear Gallery
          </Button>
        )}
      </Stack>
    </Box>
  );
};
