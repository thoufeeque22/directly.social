import { checkGlobalAbort, broadcastStatus, clearStagingStatus } from './abort-utils';
import { stageVideoFileByos } from './byos-upload-client';

import { upload } from '@vercel/blob/client';

interface StageParams {
  file: File;
  onStatusUpdate: (s: string) => void;
  metadata?: Record<string, string | boolean | undefined>;
  platforms: { platform: string; accountId: string }[];
  resumeActivityId?: string;
  signal?: AbortSignal;
}

export async function stageVideoFile({ file, onStatusUpdate, metadata, platforms, resumeActivityId, signal }: StageParams): Promise<{ stagedFileId: string; fileName: string; activityId: string }> {
  const byosRes = await fetch('/api/settings/byos', { signal }).catch(() => null);
  const byosData = (byosRes?.ok ? await byosRes.json() : null) as { config?: { provider: string; bucketName: string } } | null;
  if (byosData?.config) return stageVideoFileByos({ file, onStatusUpdate, metadata, platforms, resumeActivityId, byosConfig: byosData.config, signal });

  const uniqueSuffix = typeof window !== 'undefined' ? crypto.randomUUID().split('-')[0] : Math.random().toString(36).substring(2, 8);
  const uploadId = resumeActivityId || `up_${uniqueSuffix}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}_${file.size}`;
  if (checkGlobalAbort(uploadId)) throw new Error("Upload cancelled");

  broadcastStatus(onStatusUpdate, uploadId, "Uploading video...");

  const blob = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: '/api/upload/token',
    onUploadProgress: (progressEvent) => {
      if (checkGlobalAbort(uploadId)) throw new Error("Upload cancelled");
      broadcastStatus(onStatusUpdate, uploadId, `Uploading: ${Math.round(progressEvent.percentage)}%`, Math.round(progressEvent.percentage));
    },
    abortSignal: signal
  });

  broadcastStatus(onStatusUpdate, uploadId, "Finalizing...", 99);
  const res = await fetch(`/api/upload/assemble`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blobUrl: blob.url, fileName: file.name, totalSize: file.size, ...metadata, platforms, activityId: resumeActivityId }), signal
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Assembly failed");
  clearStagingStatus(uploadId);
  return { stagedFileId: data.data.fileId, fileName: file.name, activityId: data.data.activityId };
}
