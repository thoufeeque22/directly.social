'use client';

import React from 'react';
import { Box, Typography, Button, Skeleton, Alert, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { useByosGallery } from '@/hooks/useByosGallery';
import { ByosAssetCard } from './ByosAssetCard';

export const ByosGallery: React.FC = () => {
  const {
    assets, isLoading, error, setError, pageIndex, setPageIndex, hasNextPage,
    postingKey, deletingKey, deleteConfirmKey, setDeleteConfirmKey, handlePost, handleDelete, retry,
  } = useByosGallery();

  if (assets.length === 0 && !isLoading) {
    if (error) {
      return (
        <Stack spacing={2} sx={{ p: 2 }}>
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={retry}>Retry</Button>}>
            {error}
          </Alert>
        </Stack>
      );
    }
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: 2 }}>
        <CloudQueueIcon sx={{ fontSize: 60, opacity: 0.5, color: 'text.secondary' }} />
        <Typography variant="body1" color="text.secondary">
          No assets found in your storage bucket
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={220} />
          ))}
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
          {assets.map((asset) => (
            <ByosAssetCard
              key={asset.key}
              asset={asset}
              isPosting={postingKey === asset.key}
              isDeleting={deletingKey === asset.key}
              onPost={() => handlePost(asset)}
              onDelete={() => setDeleteConfirmKey(asset.key)}
            />
          ))}
        </Box>
      )}

      <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
        <Button size="small" onClick={() => setPageIndex((p) => p - 1)} disabled={pageIndex === 0 || isLoading}>
          Previous Page
        </Button>
        <Button size="small" onClick={() => setPageIndex((p) => p + 1)} disabled={!hasNextPage || isLoading}>
          Next Page
        </Button>
      </Stack>

      <Dialog open={!!deleteConfirmKey} onClose={() => setDeleteConfirmKey(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this asset from S3?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmKey(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (deleteConfirmKey) {
                handleDelete(deleteConfirmKey);
                setDeleteConfirmKey(null);
              }
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
