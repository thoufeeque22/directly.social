'use client';

import { useState, useEffect } from 'react';
import { GalleryAsset } from './GalleryAsset';

export function useMediaLibrary() {
  const [assets, setAssets] = useState<GalleryAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    fetch('/api/media')
      .then(res => res.json())
      .then(data => {
        setAssets(data.data || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const deleteAsset = async (fileId: string) => {
    if (!globalThis.confirm('Delete this video?')) return false;
    try {
      const res = await fetch(`/api/media/${fileId}`, { method: 'DELETE' });
      if (res.ok) {
        setAssets(prev => prev.filter(a => a.fileId !== fileId));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  return { assets, isLoading, currentTime, deleteAsset };
}
