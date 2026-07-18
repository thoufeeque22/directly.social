import { GalleryAsset } from './useMediaLibrary';
import * as React from 'react';

interface UseMediaDeleterProps {
  setAssets: React.Dispatch<React.SetStateAction<GalleryAsset[]>>;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useMediaDeleter = ({ setAssets, selectedIds, setSelectedIds }: UseMediaDeleterProps) => {
  const handleDeleteAsset = async (fileId: string) => {
    let previousAssets: GalleryAsset[] = [];
    let previousSelected: string[] = [];

    // Optimistic Update
    setAssets(prev => {
      previousAssets = prev;
      return prev.filter(a => a.fileId !== fileId);
    });
    setSelectedIds(prev => {
      previousSelected = prev;
      return prev.filter(id => id !== fileId);
    });

    try {
      const res = await fetch(`/api/media/${fileId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete asset');
      }
    } catch (err) {
      console.error(err);
      // Rollback on error
      setAssets(previousAssets);
      setSelectedIds(previousSelected);
      alert(err instanceof Error ? err.message : 'Network error while deleting asset');
    }
  };

  const handleBulkDelete = async () => {
    let previousAssets: GalleryAsset[] = [];
    let previousSelected: string[] = [];

    // Optimistic Update
    setAssets(prev => {
      previousAssets = prev;
      return prev.filter(a => !selectedIds.includes(a.fileId));
    });
    setSelectedIds(prev => {
      previousSelected = prev;
      return [];
    });

    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds: selectedIds })
      });

      if (!res.ok) {
        throw new Error('Bulk delete failed');
      }
    } catch (err) {
      console.error(err);
      // Rollback on error
      setAssets(previousAssets);
      setSelectedIds(previousSelected);
      alert(err instanceof Error ? err.message : 'Network error during bulk delete');
    }
  };

  const handleClearAll = async () => {
    let previousAssets: GalleryAsset[] = [];
    let previousSelected: string[] = [];

    // Optimistic Update
    setAssets(prev => {
      previousAssets = prev;
      return [];
    });
    setSelectedIds(prev => {
      previousSelected = prev;
      return [];
    });

    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteAll: true })
      });

      if (!res.ok) {
        throw new Error('Failed to clear gallery');
      }
    } catch (err) {
      console.error(err);
      // Rollback on error
      setAssets(previousAssets);
      setSelectedIds(previousSelected);
      alert(err instanceof Error ? err.message : 'Network error while clearing gallery');
    }
  };
  
  return { handleDeleteAsset, handleBulkDelete, handleClearAll };
};
