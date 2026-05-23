import { checkGlobalAbort, broadcastStatus } from './abort-utils';
import { sanitizeMetadata } from './metadata-utils';
import { extractPlatformPostId, generatePermalink } from '@/lib/core/distributor-utils';

interface DistributionParams {
  selectionId: string; platform: string; realAccountId: string;
  fields: Record<string, string | boolean | undefined>; fileName: string; historyId: string;
  signals?: Record<string, AbortSignal>; reviewedContent?: Record<string, unknown>;
  onPlatformStatus?: (id: string, status: string, error?: string) => void;
  onAccountSuccess?: (id: string, result: unknown) => void;
  account?: { accountName?: string | null };
}

export async function processPlatformUpload({ selectionId, platform, realAccountId, fields, fileName, historyId, signals, reviewedContent, onPlatformStatus, onAccountSuccess, account }: DistributionParams) {
  if (checkGlobalAbort(historyId)) return;
  broadcastStatus(() => {}, historyId, `Uploading to ${platform}...`);
  if (onPlatformStatus) onPlatformStatus(selectionId, 'uploading');

  try {
    const sanitized = sanitizeMetadata(platform, (fields.title as string) || '', (fields.description as string) || '');
    const res = await fetch(`/api/upload/${platform.startsWith('local') ? 'local' : platform}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stagedFileId: fields.stagedFileId, fileName, title: sanitized.title, description: sanitized.description, videoFormat: fields.videoFormat, accountId: realAccountId, contentMode: fields.contentMode, historyId, reviewedContent: reviewedContent ? reviewedContent[platform] : undefined, actualPlatform: platform }),
      signal: signals?.[selectionId]
    });
    const data = await res.json();
    if (!res.ok) throw data;

    const raw = (data.data || data) as { videoId?: string; id?: string; creationId?: string };
    const result = { accountId: selectionId, platform, accountName: account?.accountName || null, platformPostId: extractPlatformPostId(platform, raw), permalink: generatePermalink(platform, raw), status: 'success' as const, videoId: raw.videoId || raw.id, creationId: raw.creationId };
    if (onPlatformStatus) onPlatformStatus(selectionId, 'success');
    if (onAccountSuccess) onAccountSuccess(selectionId, result);
    return result;
  } catch (err: unknown) {
    const error = err as Error & { name?: string; message?: string };
    const isAborted = error.name === 'AbortError' || checkGlobalAbort(historyId);
    const result = { accountId: selectionId, platform, accountName: account?.accountName || null, status: (isAborted ? 'cancelled' : 'failed') as 'failed' | 'cancelled', errorMessage: error.message || 'Upload failed' };
    if (onPlatformStatus) onPlatformStatus(selectionId, result.status, result.errorMessage);
    if (onAccountSuccess) onAccountSuccess(selectionId, result);
    return result;
  }
}
