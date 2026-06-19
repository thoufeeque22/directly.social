import { GalleryAsset } from './useMediaLibrary';
import * as React from 'react';

interface UseMediaDeleterProps {
  setAssets: React.Dispatch<React.SetStateAction<GalleryAsset[]>>;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useMediaDeleter = ({ setAssets, selectedIds, setSelectedIds }: UseMediaDeleterProps) => {
  const handleDeleteAsset = async (fileId: string) => {
    if (!globalThis.confirm('Are you sure you want to permanentely remove this video from your staged media?')) return;

    try {
      const res = await fetch(`/api/media/${fileId}`, { method: 'DELETE' });
      if (res.ok) {
        setAssets(prev => prev.filter(a => a.fileId !== fileId));
        setSelectedIds(prev => prev.filter(id => id !== fileId));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete asset');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while deleting asset');
    }
  };

  const handleBulkDelete = async () => {
    if (!globalThis.confirm(`Are you sure you want to permanentely delete ${selectedIds.length} videos?`)) return;

    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds: selectedIds })
      });

      if (res.ok) {
        setAssets(prev => prev.filter(a => !selectedIds.includes(a.fileId)));
        setSelectedIds([]);
      } else {
        alert('Bulk delete failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (!globalThis.confirm('️WARNING: This will permanently delete EVERY video in your staged gallery. Are you absolutely sure?')) return;
    if (!globalThis.confirm('FINAL CONFIRMATION: Are you really sure you want to wipe your entire media gallery?')) return;

    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteAll: true })
      });

      if (res.ok) {
        setAssets([]);
        setSelectedIds([]);
        alert('Gallery cleared successfully.');
      } else {
        alert('Failed to clear gallery');
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  return { handleDeleteAsset, handleBulkDelete, handleClearAll };
};
