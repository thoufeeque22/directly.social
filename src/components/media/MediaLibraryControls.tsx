'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import type { GalleryAsset } from '@/hooks/useMediaLibrary';

interface MediaLibraryControlsProps {
  assets: GalleryAsset[];
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const MediaLibraryControls: React.FC<MediaLibraryControlsProps> = ({
  assets,
  selectedIds,
  setSelectedIds,
}) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
      <input
        type="checkbox"
        data-testid="select-all-checkbox"
        checked={selectedIds.length > 0 && selectedIds.length === assets.length}
        onChange={(e) => {
          if (e.target.checked) setSelectedIds(assets.map(a => a.fileId));
          else setSelectedIds([]);
        }}
        style={{ width: '18px', height: '18px' }}
      />
      <Typography variant="body2" color="text.secondary">Select All</Typography>
    </Box>
  );
};
