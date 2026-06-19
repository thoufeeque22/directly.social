
/* eslint-disable max-lines */
'use client';

import React from 'react';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { SearchField } from '@/components/ui/SearchField';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { MediaLibraryHeader } from './MediaLibraryHeader';
import { MediaLibraryGrid } from './MediaLibraryGrid';
import { MediaLibraryEmptyState } from './MediaLibraryEmptyState';
import { MediaActionsHUD } from './MediaActionsHUD';
import { MediaLibraryControls } from './MediaLibraryControls';
import { MediaLibraryDialogs } from './MediaLibraryDialogs';
import { BRAND } from '@/lib/core/brand';

export const MediaLibrary: React.FC = () => {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <MediaLibraryHeader
        onAddVideo={handleAddVideo}
        onClearAll={() => setShowClearAllDialog(true)}
        isUploading={isUploading}
        hasAssets={assets.length > 0}
      />

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

      <Box sx={{ p: '1rem', borderRadius: '12px', bgcolor: 'warning.light' }}>
        <Typography variant="body2" sx={{ color: 'warning.main', textAlign: 'center' }}>
          <strong>Note:</strong> {BRAND.name} uses a &quot;Lean Gallery&quot; approach. Videos are
          automatically purged after 7 days to keep performance high and storage costs low.
        </Typography>
      </Box>

      <MediaActionsHUD
        selectedIds={selectedIds}
        isUploading={isUploading}
        uploadStatus={uploadStatus}
        onBulkDelete={handleBulkDelete}
        onCancel={() => setSelectedIds([])}
      />

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
