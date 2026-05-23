export async function stageVideoFileByos({
  file, onStatusUpdate, metadata, platforms, resumeHistoryId, byosConfig, signal
}: { 
  file: File; onStatusUpdate: (status: string) => void;
  metadata?: any; platforms: any[]; resumeHistoryId?: string;
  byosConfig: { provider: string; bucketName: string }; signal?: AbortSignal;
}): Promise<{ stagedFileId: string; fileName: string; historyId: string }> {
  const uploadId = resumeHistoryId || `up_${Date.now()}`;
  const broadcast = (status: string, percent?: number) => onStatusUpdate(status);

  broadcast("Initializing BYOS pipeline...", 1);
  const initRes = await fetch('/api/upload/byos/presign', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'initialize', fileName: file.name, fileSize: file.size }), signal,
  });
  if (!initRes.ok) throw new Error('Failed to initialize BYOS upload');
  const { uploadId: s3UploadId, key } = await initRes.json();

  const CHUNK_SIZE = 5 * 1024 * 1024;
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const parts: { PartNumber: number; ETag: string }[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const partNumber = i + 1;
    broadcast(`Uploading to ${byosConfig.provider}: ${Math.round((i / totalChunks) * 100)}%`);
    const chunk = file.slice(i * CHUNK_SIZE, Math.min(file.size, (i + 1) * CHUNK_SIZE));

    const presignRes = await fetch('/api/upload/byos/presign', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'presignPart', fileName: file.name, uploadId: s3UploadId, key, partNumber }), signal,
    });
    const { url } = await presignRes.json();
    const uploadRes = await fetch(url, { method: 'PUT', body: chunk, signal });
    const etag = uploadRes.headers.get('ETag')?.replace(/"/g, '');
    if (!etag) throw new Error('ETag missing');
    parts.push({ PartNumber: partNumber, ETag: etag });
  }

  const completeRes = await fetch('/api/upload/byos/complete', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uploadId: s3UploadId, key, fileName: file.name, fileSize: file.size, parts, ...metadata, platforms, historyId: resumeHistoryId }), signal,
  });
  const stageResult = await completeRes.json();
  return { stagedFileId: stageResult.data.fileId, fileName: file.name, historyId: stageResult.data.historyId };
}
