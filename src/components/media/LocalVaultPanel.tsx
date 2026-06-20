'use client';

import React from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, CardActions, Alert, CircularProgress, Chip } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import RefreshIcon from '@mui/icons-material/Refresh';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import WarningIcon from '@mui/icons-material/Warning';
import { useLocalVault, LocalAsset } from '@/hooks/useLocalVault';

interface LocalVaultPanelProps {
  onPostAsset: (file: File) => void | Promise<void>;
  actionLabel?: string;
}

export const LocalVaultPanel: React.FC<LocalVaultPanelProps> = ({ onPostAsset, actionLabel }) => {
  const { connectionName, permissionState, assets, isLoading, connectDirectory, restoreAccess, disconnect, refresh } = useLocalVault();

  const handleSelect = async (asset: LocalAsset) => {
    try {
      const file = await asset.getFile();
      if (file) await onPostAsset(file);
    } catch (e) {
      console.error('Failed to resolve file', e);
    }
  };

  if (permissionState === 'unsupported') {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" icon={<WarningIcon />}>Local Gallery is unsupported by your browser. Please use a Chromium-based browser (like Chrome, Edge, or Brave).</Alert>
      </Box>
    );
  }

  if (!connectionName && (permissionState === 'prompt' || permissionState === 'denied')) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2, textAlign: 'center' }}>
        <FolderOpenIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.7 }} />
        <Typography variant="h6">Connect your Local Folder</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ maxWidth: 360 }}>Access files directly from your hard drive without cloud uploads.</Typography>
        <Button variant="contained" onClick={connectDirectory} disabled={isLoading}>Connect Directory</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1, height: '100%', overflowY: 'auto' }}>
      {permissionState === 'prompt' && (
        <Alert severity="warning" action={<Button color="inherit" size="small" onClick={restoreAccess}>Restore Access</Button>}>
          Access to the connected directory needs to be restored to read assets.
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FolderOpenIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {connectionName ? `${connectionName}: ` : ''}{assets.length} file{assets.length !== 1 && 's'} loaded
          </Typography>
          <Chip label="Local Gallery" color="success" size="small" />
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button startIcon={<RefreshIcon />} size="small" onClick={refresh} disabled={isLoading}>Refresh</Button>
          <Button startIcon={<LinkOffIcon />} size="small" color="error" onClick={disconnect}>Disconnect</Button>
        </Box>
      </Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={32} /></Box>
      ) : assets.length === 0 ? (
        <Typography color="text.secondary" align="center" variant="body2" sx={{ py: 6 }}>No videos found.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2 }}>
          {assets.map((asset) => (
            <Card key={asset.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component="video" src={asset.url} sx={{ height: 110, backgroundColor: 'black' }} />
              <CardContent sx={{ flexGrow: 1, p: 1.5, pb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{asset.fileName}</Typography>
                <Typography variant="caption" color="text.secondary">{(asset.fileSize / (1024 * 1024)).toFixed(1)} MB</Typography>
              </CardContent>
              <CardActions sx={{ p: 1.5, pt: 0 }}>
                <Button variant="outlined" size="small" fullWidth onClick={() => handleSelect(asset)}>
                  {actionLabel || 'Post'}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};
