import { useEffect } from 'react';
import { Asset } from '@/components/dashboard/DashboardClient.types';
import { Account, PlatformPreference, VideoFormat } from '@/lib/core/types';

interface UseDashboardInitializationProps {
  resumeId: string | null;
  stagedId: string | null;
  accounts: Account[];
  preferences: PlatformPreference[] | undefined;
  setVideoFormat: (v: VideoFormat) => void;
  setSelectedAccountIds: (ids: string[]) => void;
  setUploadStatus: (s: string) => void;
  setGalleryFileId: (id: string | null) => void;
  setGalleryFileName: (n: string | null) => void;
}

export function useDashboardInitialization({
  resumeId,
  stagedId,
  accounts,
  setVideoFormat,
  setSelectedAccountIds,
  setUploadStatus,
  setGalleryFileId,
  setGalleryFileName,
}: UseDashboardInitializationProps) {
  useEffect(() => {
    if (resumeId && accounts.length > 0) {
      fetch(`/api/activity/${resumeId}`)
        .then((r) => r.json())
        .then(({ data }) => {
          if (data.title) localStorage.setItem('SS_DRAFT_TITLE', data.title);
          if (data.description) localStorage.setItem('SS_DRAFT_DESC', data.description || '');
          setVideoFormat(data.videoFormat);

          const matching: string[] = [];
          const names = new Set(data.platforms.map((pl: { platform: string }) => pl.platform));

          accounts.forEach((acc) => {
            const pName = acc.provider === 'google' ? 'youtube' : acc.provider;
            if (names.has(pName)) {
              if (acc.provider === 'facebook') matching.push(`facebook:${acc.id}`, `instagram:${acc.id}`);
              else matching.push(acc.id);
            }
          });

          if (matching.length > 0) setSelectedAccountIds(matching);
          setUploadStatus(` Ready to resume: "${data.title}"`);
        })
        .catch(console.error);
    }
  }, [resumeId, accounts, setSelectedAccountIds, setUploadStatus, setVideoFormat]);

  useEffect(() => {
    if (stagedId) {
      fetch(`/api/media`)
        .then((r) => r.json())
        .then((d) => {
          const a = d.data?.find((as: Asset) => as.fileId === stagedId);
          if (a) {
            setGalleryFileId(a.fileId);
            setGalleryFileName(a.fileName);
            setUploadStatus(` Ready to post: ${a.fileName}`);
          }
        })
        .catch(console.error);
    }
  }, [stagedId, setUploadStatus, setGalleryFileId, setGalleryFileName]);
}
