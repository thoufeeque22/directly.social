import { useState, useCallback, useRef } from 'react';
import { Account } from '@/lib/core/types';
import { StyleMode } from '@/lib/core/constants';
import { distributeToPlatforms } from '@/lib/upload/upload-utils';
import { AIWriteResult } from '@/lib/utils/ai-writer';

export type PlatformStatus = 'pending' | 'uploading' | 'success' | 'failed' | 'cancelled';

export function useDistributionEngine(accounts: Account[]) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [platformStatuses, setPlatformStatuses] = useState<Record<string, PlatformStatus>>({});
  const [platformErrors, setPlatformErrors] = useState<Record<string, string>>({});
  const [successfulAccountIds, setSuccessfulAccountIds] = useState<string[]>([]);
  
  const cockpitStartedRef = useRef(false);

  const handleAbortAll = useCallback(() => {
    setIsUploading(false);
    setUploadStatus('Upload aborted');
    setPlatformStatuses({});
    setPlatformErrors({});
    cockpitStartedRef.current = false;
  }, []);

  const executeCockpitDistribution = useCallback(async (
    stagedFileId: string,
    fileName: string,
    historyId: string,
    formData: FormData,
    activeTargets: string[],
    reviewedContent?: Record<string, AIWriteResult>,
    signals?: Record<string, AbortSignal>
  ) => {
    try {
      setIsUploading(true);
      const distribution = await distributeToPlatforms({
        stagedFileId,
        fileName,
        fields: {
          contentMode: (formData.get('contentMode') as StyleMode) || 'Smart',
          videoFormat: (formData.get('videoFormat') as 'short' | 'long') || 'short',
          title: (formData.get('title') as string) || undefined,
          description: (formData.get('description') as string) || undefined,
        },
        accounts: accounts.map(a => ({ id: a.id, provider: a.provider, accountName: a.accountName })),
        selectedAccountIds: activeTargets,
        historyId,
        onStatusUpdate: setUploadStatus,
        onPlatformStatus: (id: string, status: string, error?: string) => {
          setPlatformStatuses(prev => ({ ...prev, [id]: status as PlatformStatus }));
          if (error) setPlatformErrors(prev => ({ ...prev, [id]: error }));
        },
        onAccountSuccess: (id: string, res: unknown) => {
          const result = res as { status: string };
          if (result.status === 'success') {
            setSuccessfulAccountIds(prev => [...new Set([...prev, id])]);
          }
        },
        signals
      });

      // Final status sync
      const finalResults = distribution.platformResults as any[];
      setPlatformStatuses(prev => {
        const next = { ...prev };
        finalResults.forEach((result) => {
          next[result.accountId] = result.status as PlatformStatus;
        });
        return next;
      });

      setPlatformErrors(prev => {
        const next = { ...prev };
        finalResults.forEach((result) => {
          if (result.status === 'failed') {
            next[result.accountId] = result.errorMessage || 'Unknown error';
          }
        });
        return next;
      });

      setIsUploading(false);
      return distribution;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Distribution engine failed", err);
      setUploadStatus(`❌ Distribution failed: ${errorMessage}`);
      setIsUploading(false);
      return null;
    }
  }, [accounts]);

  return {
    isUploading,
    setIsUploading,
    uploadStatus,
    setUploadStatus,
    platformStatuses,
    setPlatformStatuses,
    platformErrors,
    setPlatformErrors,
    successfulAccountIds,
    setSuccessfulAccountIds,
    executeCockpitDistribution,
    handleAbortAll,
    cockpitStartedRef
  };
}
