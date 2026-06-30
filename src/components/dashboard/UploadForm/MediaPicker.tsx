'use client';

import React, { useState } from 'react';
import MovieIcon from '@mui/icons-material/Movie';
import CloseIcon from '@mui/icons-material/Close';
import { Capacitor } from '@capacitor/core';
import { GlassCard } from '@/components/ui/GlassCard';
import { GalleryAsset } from './GalleryAsset';
import { useMediaLibrary } from './useMediaLibrary';
import { AssetSearch } from './AssetSearch';
import { GalleryGrid } from './GalleryGrid';
import { Tabs, Tab, Box } from '@mui/material';
import { useUploadFormContext } from './UploadFormContext';
import { LocalVaultPanel } from '@/components/media/LocalVaultPanel';
import { storeDraftFile } from '@/lib/upload/file-store';

interface MediaPickerProps {
  onSelect: (asset: GalleryAsset) => void;
  onClose: () => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ onSelect, onClose }) => {
  const { assets: stagedAssets, isLoading: isStagedLoading, currentTime, deleteAsset } = useMediaLibrary();
  const { onFileChange } = useUploadFormContext();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = stagedAssets.filter(a => a.fileName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={styles.overlay}>
      <GlassCard style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close picker"><CloseIcon /></button>
        <h3 style={styles.title}><MovieIcon className="text-primary" sx={{ fontSize: 20 }} />Choose Media</h3>
        <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Staged Media" />
          {(!Capacitor.isNativePlatform()) && (
            <Tab label="Local Gallery" />
          )}
        </Tabs>
        {tabValue === 0 ? (
          <>
            <AssetSearch query={searchQuery} onChange={setSearchQuery} />
            <GalleryGrid isLoading={isStagedLoading} assets={filteredAssets} searchQuery={searchQuery} currentTime={currentTime} onSelect={onSelect} onDelete={(e, fileId) => { e.stopPropagation(); deleteAsset(fileId); }} />
            <div style={styles.footer}><p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(var(--warning))', textAlign: 'center' }}>Videos are automatically purged after 7 days to save space.</p></div>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: 200 }}>
            <LocalVaultPanel
              actionLabel="Select"
              onPostAsset={async (file) => {
                await storeDraftFile(file);
                onFileChange(file);
                onClose();
              }}
            />
          </Box>
        )}
      </GlassCard>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' } as React.CSSProperties,
  modal: { width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1.5rem', position: 'relative' } as React.CSSProperties,
  closeBtn: { position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', color: 'hsl(var(--foreground))', cursor: 'pointer' } as React.CSSProperties,
  title: { fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' } as React.CSSProperties,
  footer: { marginTop: '1.5rem', padding: '0.75rem', borderRadius: '0.5rem', background: 'hsla(var(--warning) / 0.1)', border: '1px solid hsla(var(--warning) / 0.2)' } as React.CSSProperties,
};
