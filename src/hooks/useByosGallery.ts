import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { ByosAsset } from '@/components/media/ByosAssetCard';

export function useByosGallery() {
  const router = useRouter();
  const [assets, setAssets] = useState<ByosAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [tokenStack, setTokenStack] = useState<(string | undefined)[]>([undefined]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [postingKey, setPostingKey] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<string | null>(null);
  const lastFetchedIndexRef = useRef<number | null>(null);

  const fetchAssets = useCallback(async (token: string | undefined) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = token ? `/api/media/byos?continuationToken=${encodeURIComponent(token)}` : '/api/media/byos';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Failed to connect');
      setAssets(result.data);
      setHasNextPage(result.hasNextPage);
      if (result.nextContinuationToken) {
        setTokenStack((prev) => {
          const next = [...prev];
          next[pageIndex + 1] = result.nextContinuationToken;
          return next;
        });
      }
    } catch {
      setError('Failed to connect to storage. Verify credentials in settings.');
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        if (lastFetchedIndexRef.current === pageIndex) return;
        lastFetchedIndexRef.current = pageIndex;
        fetchAssets(tokenStack[pageIndex]);
      }
    });
    return () => { active = false; };
  }, [pageIndex, fetchAssets, tokenStack]);

  const handlePost = async (asset: ByosAsset) => {
    if (asset.status === 'Cloud' && asset.fileId) return router.push(`/?staged=${asset.fileId}`);
    setPostingKey(asset.key);
    try {
      const res = await fetch('/api/media/register-byos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: asset.key, fileName: asset.fileName, fileSize: asset.fileSize }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.success) router.push(`/?staged=${data.fileId}`);
    } catch {
      setError('Failed to register asset in database.');
    } finally {
      setPostingKey(null);
    }
  };

  const handleDelete = async (key: string) => {
    setDeletingKey(key);
    try {
      const res = await fetch('/api/media/byos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      if (res.status === 403) setError('Failed to delete asset. Insufficient bucket delete permissions.');
      else if (!res.ok) throw new Error();
      else fetchAssets(tokenStack[pageIndex]);
    } catch {
      setError('Failed to delete asset from S3.');
    } finally {
      setDeletingKey(null);
    }
  };

  return {
    assets, isLoading, error, setError, pageIndex, setPageIndex, hasNextPage,
    postingKey, deletingKey, deleteConfirmKey, setDeleteConfirmKey, handlePost, handleDelete,
    retry: () => fetchAssets(tokenStack[pageIndex]),
  };
}
