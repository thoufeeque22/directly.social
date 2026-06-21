'use client';
import React from 'react';
import { Box, Typography, Button, Stack, Chip, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { MediaPreview } from './MediaPreview';

export interface ByosAsset {
  key: string;
  fileName: string;
  fileSize: number;
  lastModified: string;
  status: 'Cloud' | 'External';
  fileId: string | null;
  previewUrl: string;
}
interface ByosAssetCardProps {
  asset: ByosAsset;
  isPosting: boolean;
  isDeleting: boolean;
  onPost: () => void;
  onDelete: () => void;
}
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
export const ByosAssetCard: React.FC<ByosAssetCardProps> = ({
  asset, isPosting, isDeleting, onPost, onDelete,
}) => {
  const dateStr = asset.lastModified.split('T')[0] || '';
  return (
    <Box
      data-testid="byos-asset-card"
      sx={{
        p: 1, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid',
        borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 1,
        transition: 'all 0.2s ease', position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
        <Chip
          label={asset.status} size="small"
          color={asset.status === 'Cloud' ? 'success' : 'default'} sx={{ fontWeight: 'bold' }}
        />
      </Box>
      <MediaPreview src={asset.previewUrl} isGrid />
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {asset.fileName}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', fontSize: '0.65rem', color: 'text.secondary' }}>
        <span>{formatBytes(asset.fileSize)}</span>
        <span>{dateStr}</span>
      </Box>
      <Stack direction="row" spacing={0.5}>
        <Button
          size="small" variant="contained" onClick={onPost} disabled={isPosting || isDeleting}
          startIcon={isPosting ? <CircularProgress size={14} color="inherit" /> : <PostAddIcon sx={{ fontSize: 14 }} />}
          sx={{ flexGrow: 1 }}
        >
          Post
        </Button>
        <Button
          size="small" color="error" variant="outlined" onClick={onDelete} disabled={isPosting || isDeleting}
          data-testid="delete-byos-asset" aria-label="Delete Asset"
        >
          {isDeleting ? <CircularProgress size={14} color="error" /> : <DeleteIcon sx={{ fontSize: 14 }} />}
        </Button>
      </Stack>
    </Box>
  );
};
