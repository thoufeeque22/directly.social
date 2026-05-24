'use client';

import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StorageIcon from '@mui/icons-material/Storage';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';
import { GalleryAsset } from './GalleryAsset';
import { MediaPreview } from './MediaPreview';
import { formatSize, getRemainingTimeInfo } from './mediaUtils';

interface AssetItemProps {
  asset: GalleryAsset;
  currentTime: number;
  onSelect: (asset: GalleryAsset) => void;
  onDelete: (e: React.MouseEvent, fileId: string) => void;
}

export const AssetItem: React.FC<AssetItemProps> = ({ asset, currentTime, onSelect, onDelete }) => {
  const timeInfo = getRemainingTimeInfo(asset.expiresAt, currentTime);

  return (
    <div 
      onClick={() => onSelect(asset)}
      style={itemStyle}
      onMouseEnter={(e) => e.currentTarget.style.background = 'hsla(var(--primary) / 0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'hsla(var(--foreground) / 0.05)'}
    >
      <MediaPreview src={asset.previewUrl} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={fileNameStyle}>{asset.fileName}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
          <span style={metaStyle}><StorageIcon sx={{ fontSize: 12 }} />{formatSize(asset.fileSize)}</span>
          <span style={{ ...metaStyle, color: timeInfo.isExpiringSoon ? '#ef4444' : 'hsl(var(--muted-foreground))', fontWeight: timeInfo.isExpiringSoon ? 600 : 400 }}>
            {timeInfo.isExpiringSoon ? <WarningIcon sx={{ fontSize: 12 }} /> : <AccessTimeIcon sx={{ fontSize: 12 }} />}
            {timeInfo.text}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button onClick={(e) => onDelete(e, asset.fileId)} style={deleteButtonStyle}><DeleteIcon sx={{ fontSize: 16 }} /></button>
        <div style={{ color: 'hsl(var(--primary))' }}><CheckIcon sx={{ fontSize: 18 }} /></div>
      </div>
    </div>
  );
};

const itemStyle: React.CSSProperties = { padding: '1rem', borderRadius: '0.75rem', background: 'hsla(var(--foreground) / 0.05)', border: '1px solid hsla(var(--border) / 0.3)', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '1rem' };
const fileNameStyle: React.CSSProperties = { margin: 0, fontWeight: 500, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const metaStyle: React.CSSProperties = { fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center', gap: '0.25rem' };
const deleteButtonStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' };
