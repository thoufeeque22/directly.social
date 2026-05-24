'use client';

import React from 'react';
import { GalleryAsset } from './GalleryAsset';
import { AssetItem } from './AssetItem';

interface GalleryGridProps {
  isLoading: boolean;
  assets: GalleryAsset[];
  searchQuery: string;
  currentTime: number;
  onSelect: (asset: GalleryAsset) => void;
  onDelete: (e: React.MouseEvent, fileId: string) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ 
  isLoading, assets, searchQuery, currentTime, onSelect, onDelete 
}) => {
  if (isLoading) {
    return <div style={centerTextStyle}>Loading media library...</div>;
  }

  if (assets.length === 0) {
    return (
      <div style={centerTextStyle}>
        {searchQuery ? 'No matching videos found.' : 'No staged videos yet. Upload your first video!'}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {assets.map(asset => (
        <AssetItem key={asset.id} asset={asset} currentTime={currentTime} onSelect={onSelect} onDelete={onDelete} />
      ))}
    </div>
  );
};

const centerTextStyle: React.CSSProperties = { padding: '2rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))' };
