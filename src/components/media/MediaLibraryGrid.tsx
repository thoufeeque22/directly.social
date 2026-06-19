'use client';

import React from 'react';
import { Box } from '@mui/material';
import { MediaAssetCard } from './MediaAssetCard';
import type { GalleryAsset } from '@/hooks/useMediaLibrary';

interface MediaLibraryGridProps {
  assets: GalleryAsset[];
  selectedIds: string[];
  getRemainingTimeInfo: (expiresAt: string) => { text: string; isExpiringSoon: boolean };
  toggleSelect: (fileId: string) => void;
  handleDeleteAsset: (fileId: string) => void;
}

export const MediaLibraryGrid: React.FC<MediaLibraryGridProps> = ({
  assets,
  selectedIds,
  getRemainingTimeInfo,
  toggleSelect,
  handleDeleteAsset,
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '0.75rem',
      }}
    >
      {assets.map((asset) => (
        <MediaAssetCard
          key={asset.id}
          asset={asset}
          isSelected={selectedIds.includes(asset.fileId)}
          timeInfo={getRemainingTimeInfo(asset.expiresAt)}
          onToggleSelect={() => toggleSelect(asset.fileId)}
          onDelete={() => handleDeleteAsset(asset.fileId)}
        />
      ))}
    </Box>
  );
};
