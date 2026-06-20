
/* eslint-disable max-lines */
'use client';

import React from 'react';
import { Box, CircularProgress, Paper, Typography, Tab, Tabs, Button, Stack } from '@mui/material';
import { Add as Plus, Delete as Trash2 } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { storeDraftFile } from '@/lib/upload/file-store';
import { SearchField } from '@/components/ui/SearchField';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { MediaLibraryHeader } from './MediaLibraryHeader';
import { MediaLibraryGrid } from './MediaLibraryGrid';
import { MediaLibraryEmptyState } from './MediaLibraryEmptyState';
import { MediaActionsHUD } from './MediaActionsHUD';
import { MediaLibraryControls } from './MediaLibraryControls';
import { MediaLibraryDialogs } from './MediaLibraryDialogs';
import { LocalVaultView } from './LocalVaultView';

export const MediaLibrary: React.FC = () => {
  const router = useRouter();
  const {
    assets,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedIds,
    isUploading,
    uploadStatus,
    fileInputRef,
    handleAddVideo,
    handleFileChange,
    getRemainingTimeInfo,
    handleDeleteAsset,
    handleBulkDelete,
    handleClearAll,
    toggleSelect,
    setSelectedIds,
  } = useMediaLibrary();

  const [tabValue, setTabValue] = React.useState(0);
  const [singleDeleteId, setSingleDeleteId] = React.useState<string | null>(null);
  const [showClearAllDialog, setShowClearAllDialog] = React.useState(false);

  const handleSingleDeleteConfirm = async () => {
    if (singleDeleteId) {
      await handleDeleteAsset(singleDeleteId);
      setSingleDeleteId(null);
    }
  };

  const handleClearAllConfirm = async () => {
    await handleClearAll();
    setShowClearAllDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <MediaLibraryHeader
        actions={
          tabValue === 0 && (
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Plus sx={{ fontSize: 18 }} />}
                onClick={handleAddVideo}
                disabled={isUploading}
                data-testid="header-upload-button"
                sx={{
                  fontWeight: 'bold',
                  boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}4D`,
                }}
              >
                Upload
              </Button>
              {assets.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Trash2 sx={{ fontSize: 16 }} />}
                  onClick={() => setShowClearAllDialog(true)}
                  disabled={isUploading}
                  data-testid="clear-gallery"
                >
                  Clear Gallery
                </Button>
              )}
            </Stack>
          )
        }
      />

      <Tabs
        value={tabValue}
        onChange={(_, val) => setTabValue(val)}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Cloud Gallery" />
        <Tab label="Local Vault" />
      </Tabs>

      {tabValue === 0 ? (
        <>
          <Box sx={{ p: '1rem', borderRadius: '12px', bgcolor: 'warning.main' }}>
            <Typography variant="body2" sx={{ color: 'warning.contrastText', textAlign: 'center' }}>
              <strong>Note:</strong> To keep your workspace fast and organized, uploaded videos are automatically removed after 7 days.
            </Typography>
          </Box>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            style={{ display: 'none' }}
          />

          <Paper elevation={0} sx={{ p: '1.5rem', borderRadius: '12px' }}>
            <SearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search your library..."
            />

            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '200px',
                }}
              >
                <CircularProgress />
              </Box>
            ) : assets.length === 0 ? (
              <MediaLibraryEmptyState searchQuery={searchQuery} onUpload={handleAddVideo} />
            ) : (
              <Box>
                <MediaLibraryControls assets={assets} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
                <MediaLibraryGrid
                  assets={assets}
                  selectedIds={selectedIds}
                  getRemainingTimeInfo={getRemainingTimeInfo}
                  toggleSelect={toggleSelect}
                  handleDeleteAsset={(id) => setSingleDeleteId(id)}
                />
              </Box>
            )}
          </Paper>

          <MediaActionsHUD
            selectedIds={selectedIds}
            isUploading={isUploading}
            uploadStatus={uploadStatus}
            onBulkDelete={handleBulkDelete}
            onCancel={() => setSelectedIds([])}
          />
        </>
      ) : (
        <Paper elevation={0} sx={{ p: '1.5rem', borderRadius: '12px' }}>
          <LocalVaultView onPostAsset={async (file) => {
            await storeDraftFile(file);
            router.push('/');
          }} />
        </Paper>
      )}

      <MediaLibraryDialogs
        singleDeleteId={singleDeleteId}
        setSingleDeleteId={setSingleDeleteId}
        onSingleDeleteConfirm={handleSingleDeleteConfirm}
        showClearAllDialog={showClearAllDialog}
        setShowClearAllDialog={setShowClearAllDialog}
        onClearAllConfirm={handleClearAllConfirm}
      />
    </Box>
  );
};
