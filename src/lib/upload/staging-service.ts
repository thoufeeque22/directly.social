import { checkGlobalAbort, broadcastStatus, clearStagingStatus } from './abort-utils';
import { stageVideoFileByos } from './byos-upload-client';

export async function uploadChunk(uploadId: string, index: number, chunk: Blob, signal?: AbortSignal) {
  for (let retry = 0; retry < 3; retry++) {
    if (checkGlobalAbort(uploadId)) throw new Error("Upload cancelled");
    try {
      const res = await fetch(`/api/upload/chunk`, {
        method: 'POST', headers: { 'x-upload-id': uploadId, 'x-chunk-index': index.toString() }, body: chunk, signal
      });
      if (res.ok) return true;
    } catch (e) { console.warn(`Chunk ${index} failed attempt ${retry + 1}`, e); }
  }
  return false;
}

export async function stageVideoFile({ file, onStatusUpdate, metadata, platforms, resumeHistoryId, signal }: any): Promise<any> {
  const byosRes = await fetch('/api/settings/byos', { signal }).catch(() => null);
  const byosData = byosRes?.ok ? await byosRes.json() : null;
  if (byosData?.config) return stageVideoFileByos({ file, onStatusUpdate, metadata, platforms, resumeHistoryId, byosConfig: byosData.config, signal });

  const uploadId = resumeHistoryId || `up_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}_${file.size}`;
  if (checkGlobalAbort(uploadId)) throw new Error("Upload cancelled");

  broadcastStatus(onStatusUpdate, uploadId, "Resuming stream...");
  const chunksRes = await fetch(`/api/upload/chunks/${uploadId}`, { signal }).catch(() => null);
  const existingChunks = chunksRes?.ok ? (await chunksRes.json()).chunks || [] : [];

  const CHUNK_SIZE = 5 * 1024 * 1024;
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  
  for (let i = 0; i < totalChunks; i++) {
    if (existingChunks.includes(i)) continue;
    broadcastStatus(onStatusUpdate, uploadId, `Streaming: ${Math.round((i / totalChunks) * 100)}%`, Math.round((i / totalChunks) * 100));
    const success = await uploadChunk(uploadId, i, file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE), signal);
    if (!success) throw new Error("Stream interrupted");
  }

  broadcastStatus(onStatusUpdate, uploadId, "Finalizing...", 99);
  const res = await fetch(`/api/upload/assemble`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uploadId, fileName: file.name, totalChunks, totalSize: file.size, ...metadata, platforms, historyId: resumeHistoryId }), signal
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Assembly failed");
  clearStagingStatus(uploadId);
  return { stagedFileId: data.data.fileId, fileName: file.name, historyId: data.data.historyId };
}
