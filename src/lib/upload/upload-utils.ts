import { checkGlobalAbort, clearStagingStatus } from './abort-utils';
import { stageVideoFile } from './staging-service';
import { processPlatformUpload } from './distribution-service';

export { stageVideoFile };

const MAX_PARALLEL_DISTRIBUTIONS = 3;

interface DistributionParams {
  stagedFileId: string;
  fileName: string;
  selectedAccountIds: string[];
  accounts: { id: string; provider: string; accountName?: string | null }[];
  historyId: string;
  fields?: Record<string, string | boolean | undefined>;
  onStatusUpdate?: (s: string) => void;
  onPlatformStatus?: (id: string, status: string, error?: string) => void;
  onAccountSuccess?: (id: string, result: unknown) => void;
  signals?: Record<string, AbortSignal>;
}

export async function distributeToPlatforms(params: DistributionParams): Promise<{ platformResults: unknown[] }> {
  const { selectedAccountIds, accounts, historyId } = params;
  const platformResults: unknown[] = [];
  const queue = [...selectedAccountIds];
  
  const processOne = async (selectionId: string) => {
    if (checkGlobalAbort(historyId)) return;
    const [p, accId] = selectionId.includes(':') ? selectionId.split(':') : [null, selectionId];
    let platform = p;
    const realAccountId = accId;

    if (!platform) {
      const acc = accounts.find((a) => a.id === realAccountId);
      if (!acc) return;
      platform = acc.provider === 'google' ? 'youtube' : acc.provider;
    }
    
    const result = await processPlatformUpload({ 
      ...params, selectionId, platform: platform!, realAccountId, 
      fields: { ...params.fields, stagedFileId: params.stagedFileId }, 
      account: accounts.find((a) => a.id === realAccountId) 
    });
    if (result) platformResults.push(result);
  };

  const workers = [];
  const workerCount = Math.min(MAX_PARALLEL_DISTRIBUTIONS, queue.length);
  for (let i = 0; i < workerCount; i++) {
    workers.push((async () => {
      while (queue.length > 0 && !checkGlobalAbort(historyId)) {
        const id = queue.shift();
        if (id) await processOne(id);
      }
    })());
  }
  await Promise.all(workers);
  clearStagingStatus(historyId);
  return { platformResults };
}

interface MultiUploadParams {
  formData: FormData;
  onStatusUpdate: (s: string) => void;
  selectedAccountIds: string[];
  accounts: { id: string; provider: string; accountName?: string | null }[];
}

export async function performMultiPlatformUpload(params: MultiUploadParams): Promise<{ platformResults: unknown[]; stagedFileId: string }> {
  const file = params.formData.get('file') as File;
  const title = (params.formData.get('title') as string) || '';
  const { stagedFileId, fileName } = await stageVideoFile({ 
    file, onStatusUpdate: params.onStatusUpdate, platforms: [], 
    metadata: { title } 
  });
  const results = await distributeToPlatforms({ 
    ...params, stagedFileId, fileName, historyId: '',
    fields: { title }
  });
  return { ...results, stagedFileId };
}
