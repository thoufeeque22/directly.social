import { checkGlobalAbort, broadcastStatus, clearStagingStatus } from './abort-utils';
import { stageVideoFileByos } from './byos-upload-client';


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

  const presignRes = await fetch('/api/upload/presigned-url', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, size: file.size, contentType: file.type }), signal
  });
  if (!presignRes.ok) throw new Error("Failed to get upload URL");
  const { url, publicUrl } = await presignRes.json();

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', file.type);
    
    xhr.upload.onprogress = (event) => {
      if (checkGlobalAbort(uploadId)) { xhr.abort(); return reject(new Error("Upload cancelled")); }
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        broadcastStatus(onStatusUpdate, uploadId, `Uploading: ${percentage}%`, percentage);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed with status ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("Upload network error"));
    xhr.onabort = () => reject(new Error("Upload cancelled"));
    
    if (signal) signal.addEventListener('abort', () => { xhr.abort(); reject(new Error("Upload cancelled")); });
    
    xhr.send(file);
  });

  broadcastStatus(onStatusUpdate, uploadId, "Finalizing...", 99);
  const res = await fetch(`/api/upload/assemble`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blobUrl: publicUrl, fileName: file.name, totalSize: file.size, ...metadata, platforms, activityId: resumeActivityId }), signal
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Assembly failed");
  clearStagingStatus(uploadId);
  return { stagedFileId: data.data.fileId, fileName: file.name, activityId: data.data.activityId };
}
