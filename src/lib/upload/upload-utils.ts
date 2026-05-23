import { checkGlobalAbort, clearStagingStatus } from './abort-utils';
import { stageVideoFile } from './staging-service';
import { processPlatformUpload } from './distribution-service';

export { stageVideoFile };

export async function distributeToPlatforms(params: any): Promise<any> {
  const { stagedFileId, fileName, selectedAccountIds, accounts, historyId } = params;
  const platformResults: any[] = [];
  const queue = [...selectedAccountIds];
  
  const processOne = async (selectionId: string) => {
    if (checkGlobalAbort(historyId)) return;
    let [platform, realAccountId] = selectionId.includes(':') ? selectionId.split(':') : [null, selectionId];
    if (!platform) {
      const acc = accounts.find((a: any) => a.id === realAccountId);
      if (!acc) return;
      platform = acc.provider === 'google' ? 'youtube' : acc.provider;
    }
    const result = await processPlatformUpload({ ...params, selectionId, platform, realAccountId, fields: { ...params.fields, stagedFileId }, fileName, account: accounts.find((a: any) => a.id === realAccountId) });
    if (result) platformResults.push(result);
  };

  const workers = [];
  const concurrency = 2; 
  for (let i = 0; i < Math.min(concurrency, queue.length); i++) {
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

export async function performMultiPlatformUpload(params: any): Promise<any> {
  const file = params.formData.get('file') as File;
  const { stagedFileId, fileName } = await stageVideoFile({ file, onStatusUpdate: params.onStatusUpdate, platforms: [], metadata: { title: params.formData.get('title') as string } });
  const results = await distributeToPlatforms({ ...params, stagedFileId, fileName, historyId: '' });
  return { ...results, stagedFileId };
}
