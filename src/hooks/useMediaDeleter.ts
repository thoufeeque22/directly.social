import { GalleryAsset } from './useMediaLibrary';
import * as React from 'react';

interface UseMediaDeleterProps {
  setAssets: React.Dispatch<React.SetStateAction<GalleryAsset[]>>;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useMediaDeleter = ({ setAssets, selectedIds, setSelectedIds }: UseMediaDeleterProps) => {
  const handleDeleteAsset = async (fileId: string) => {
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
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteAll: true })
      });

      if (res.ok) {
        setAssets([]);
        setSelectedIds([]);
      } else {
        alert('Failed to clear gallery');
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  return { handleDeleteAsset, handleBulkDelete, handleClearAll };
};
