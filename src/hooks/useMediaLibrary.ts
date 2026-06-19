'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMediaDeleter } from './useMediaDeleter';
import { useMediaUploader } from './useMediaUploader';
import { useTimeInfo } from './useTimeInfo';

export interface GalleryAsset {
  id: string;
  fileId: string;
  fileName: string;
  fileSize: number | null;
  expiresAt: string;
  createdAt: string;
  previewUrl?: string;
}

export const useMediaLibrary = () => {
  const [assets, setAssets] = useState<GalleryAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchAssets = async (search?: string) => {
    try {
      setIsLoading(true);
      const url = new URL('/api/media', window.location.origin);
      if (search) url.searchParams.set('search', search);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setAssets(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssets(searchQuery);
    }, searchQuery ? 400 : 0);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    isUploading,
    uploadStatus,
    fileInputRef,
    handleAddVideo,
    handleFileChange
  } = useMediaUploader({ fetchAssets });

  const { handleDeleteAsset, handleBulkDelete, handleClearAll } = useMediaDeleter({
    setAssets,
    selectedIds,
    setSelectedIds,
  });

  const { getRemainingTimeInfo } = useTimeInfo();

  const toggleSelect = (fileId: string) => {
    setSelectedIds(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return {
    assets,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedIds,
    isUploading,
    uploadStatus,
    fileInputRef,
    fetchAssets,
    handleAddVideo,
    handleFileChange,
    getRemainingTimeInfo,
    handleDeleteAsset,
    handleBulkDelete,
    handleClearAll,
    toggleSelect,
    setSelectedIds,
  };
};
