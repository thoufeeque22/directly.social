import { checkGlobalAbort, broadcastStatus } from './abort-utils';
import { sanitizeMetadata } from './metadata-utils';
import { extractPlatformPostId, generatePermalink } from '@/lib/core/distributor-utils';

export async function processPlatformUpload({ selectionId, platform, realAccountId, fields, fileName, historyId, signals, reviewedContent, onPlatformStatus, onAccountSuccess, account }: any) {
  if (checkGlobalAbort(historyId)) return;
  broadcastStatus(() => {}, historyId, `Uploading to ${platform}...`);
  if (onPlatformStatus) onPlatformStatus(selectionId, 'uploading');

  try {
    const sanitized = sanitizeMetadata(platform, fields.title, fields.description);
    const res = await fetch(`/api/upload/${platform.startsWith('local') ? 'local' : platform}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stagedFileId: fields.stagedFileId, fileName, title: sanitized.title, description: sanitized.description, videoFormat: fields.videoFormat, accountId: realAccountId, contentMode: fields.contentMode, historyId, reviewedContent: reviewedContent ? reviewedContent[platform] : undefined, actualPlatform: platform }),
      signal: signals?.[selectionId]
    });
    const data = await res.json();
    if (!res.ok) throw data;

    const raw = data.data || data;
    const result = { accountId: selectionId, platform, accountName: account?.accountName || null, platformPostId: extractPlatformPostId(platform, raw), permalink: generatePermalink(platform, raw), status: 'success', videoId: raw.videoId || raw.id, creationId: raw.creationId };
    if (onPlatformStatus) onPlatformStatus(selectionId, 'success');
    if (onAccountSuccess) onAccountSuccess(selectionId, result);
    return result;
  } catch (err: any) {
    const isAborted = err.name === 'AbortError' || checkGlobalAbort(historyId);
    const result = { accountId: selectionId, platform, accountName: account?.accountName || null, status: isAborted ? 'cancelled' : 'failed', errorMessage: err.message || 'Upload failed' };
    if (onPlatformStatus) onPlatformStatus(selectionId, result.status as any, result.errorMessage);
    if (onAccountSuccess) onAccountSuccess(selectionId, result as any);
    return result;
  }
}
