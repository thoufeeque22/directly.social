'use client';

import React, { useState } from 'react';
import MovieIcon from '@mui/icons-material/Movie';
import CloseIcon from '@mui/icons-material/Close';
import { GlassCard } from '@/components/ui/GlassCard';
import { GalleryAsset } from './GalleryAsset';
import { useMediaLibrary } from './useMediaLibrary';
import { AssetSearch } from './AssetSearch';
import { GalleryGrid } from './GalleryGrid';

interface MediaPickerProps {
  onSelect: (asset: GalleryAsset) => void;
  onClose: () => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ onSelect, onClose }) => {
  const { assets, isLoading, currentTime, deleteAsset } = useMediaLibrary();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = assets.filter(asset => 
    asset.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={overlayStyle}>
      <GlassCard style={modalStyle}>
        <button onClick={onClose} style={closeButtonStyle}><CloseIcon /></button>

        <h3 style={titleStyle}>
          <MovieIcon className="text-primary" sx={{ fontSize: 20 }} />
          Choose from Staged Media
        </h3>

        <AssetSearch query={searchQuery} onChange={setSearchQuery} />

        <GalleryGrid 
          isLoading={isLoading} 
          assets={filteredAssets} 
          searchQuery={searchQuery} 
          currentTime={currentTime} 
          onSelect={onSelect} 
          onDelete={(e, fileId) => { e.stopPropagation(); deleteAsset(fileId); }} 
        />

        <div style={footerStyle}>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(var(--warning))', textAlign: 'center' }}>
            Videos are automatically purged after 7 days to save space.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' };
const modalStyle: React.CSSProperties = { width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1.5rem', position: 'relative' };
const closeButtonStyle: React.CSSProperties = { position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', color: 'hsl(var(--foreground))', cursor: 'pointer' };
const titleStyle: React.CSSProperties = { fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' };
const footerStyle: React.CSSProperties = { marginTop: '1.5rem', padding: '0.75rem', borderRadius: '0.5rem', background: 'hsla(var(--warning) / 0.1)', border: '1px solid hsla(var(--warning) / 0.2)' };
