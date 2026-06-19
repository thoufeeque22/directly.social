'use client';

import React from 'react';
import { Box, Typography, Button, Checkbox, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { MediaPreview } from './MediaPreview';
import type { GalleryAsset } from '@/hooks/useMediaLibrary';

interface MediaAssetCardProps {
  asset: GalleryAsset;
  isSelected: boolean;
  timeInfo: { text: string; isExpiringSoon: boolean };
  onToggleSelect: () => void;
  onDelete: () => void;
}

export const MediaAssetCard: React.FC<MediaAssetCardProps> = ({
  asset,
  isSelected,
  timeInfo,
  onToggleSelect,
  onDelete,
}) => {
  return (
    <Box
      data-testid="media-asset-card"
      sx={{
        p: 1,
        borderRadius: 3,
        bgcolor: isSelected ? 'primary.light' : 'background.paper',
        border: '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      <Checkbox
        checked={isSelected}
        onChange={onToggleSelect}
        sx={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 10,
          color: 'white',
          '&.Mui-checked': {
            color: 'primary.main',
          },
        }}
      />
      <MediaPreview src={asset.previewUrl} isGrid />

      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {asset.fileName}
      </Typography>

      <Box
        sx={{
          p: '0.4rem 0.6rem',
          borderRadius: 1,
          bgcolor: timeInfo.isExpiringSoon ? 'error.light' : 'action.hover',
          color: timeInfo.isExpiringSoon ? 'error.main' : 'text.secondary',
          fontSize: '0.65rem',
          fontWeight: timeInfo.isExpiringSoon ? 700 : 400,
        }}
      >
        {timeInfo.text}
      </Box>

      <Stack direction="row" spacing={0.5}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => (window.location.href = `/?staged=${asset.fileId}`)}
        >
          Post
        </Button>
        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={onDelete}
          data-testid="delete-asset"
          aria-label="Delete Asset"
        >
          <DeleteIcon sx={{ fontSize: 14 }} />
        </Button>
      </Stack>
    </Box>
  );
};
