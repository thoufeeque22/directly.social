import { describe, it, expect, vi, Mock } from 'vitest';
import { distributeToPlatforms } from '@/lib/upload/upload-utils';
import { Account } from '@/lib/core/types';

vi.mock('@/lib/core/platform-route-handler', () => ({
  handlePlatformUploadRequest: vi.fn()
}));

describe('Distribution Engine Parallelism', () => {
  it('should process uploads in parallel with limited concurrency', async () => {
    const onPlatformStatus = vi.fn();
    const mockedFetch = global.fetch as Mock;
    
    // Control fetch completion
    let activeRequests = 0;
    let maxConcurrent = 0;

    mockedFetch.mockImplementation(async () => {
      activeRequests++;
      maxConcurrent = Math.max(maxConcurrent, activeRequests);
      // simulate network delay
      await new Promise(r => setTimeout(r, 50));
      activeRequests--;
      return { 
        ok: true, 
        json: async () => ({ 
          success: true,
          data: { id: '123', url: 'http://test.com' } 
        }) 
      };
    });

    const selectedAccountIds = ['platform1', 'platform2', 'platform3', 'platform4'];
    const accounts: any[] = selectedAccountIds.map(id => ({ 
      id, 
      provider: id, 
      accountName: id,
      isDistributionEnabled: true
    }));

    const distributionPromise = distributeToPlatforms({
      stagedFileId: 'stage1',
      fileName: 'test.mp4',
      historyId: 'hist1',
      accounts,
      selectedAccountIds,
      fields: {
        contentMode: 'Smart',
        videoFormat: 'short',
      },
      onPlatformStatus
    });

    // Immediately check if all were set to 'uploading'
    // Wait a tiny bit for the microtask queue
    await new Promise(r => setTimeout(r, 10));

    expect(onPlatformStatus).toHaveBeenCalledWith('platform1', 'uploading', undefined);
    expect(onPlatformStatus).toHaveBeenCalledWith('platform2', 'uploading', undefined);

    await distributionPromise;
    expect(onPlatformStatus).toHaveBeenCalledWith('platform1', 'success', undefined);
  });

  it('should limit concurrency for multiple files', async () => {
    const onPlatformStatus = vi.fn();
    const mockedFetch = global.fetch as Mock;
    
    // Control fetch completion
    let activeRequests = 0;
    let maxConcurrent = 0;

    mockedFetch.mockImplementation(async () => {
      activeRequests++;
      maxConcurrent = Math.max(maxConcurrent, activeRequests);
      await new Promise(r => setTimeout(r, 50));
      activeRequests--;
      return { 
        ok: true, 
        json: async () => ({ 
          success: true,
          data: { id: '123' } 
        }) 
      };
    });

    const selectedAccountIds = ['p1', 'p2', 'p3'];
    const accounts: any[] = selectedAccountIds.map(id => ({ 
      id, 
      provider: id, 
      accountName: id,
      isDistributionEnabled: true
    }));

    await distributeToPlatforms({
      stagedFileId: 'stage2',
      fileName: 'large.mp4',
      historyId: 'hist2',
      accounts,
      selectedAccountIds,
      fields: {
        contentMode: 'Smart',
        videoFormat: 'short',
      },
      onPlatformStatus
    });

    // Default concurrency is 2 in upload-utils.ts
    expect(maxConcurrent).toBeLessThanOrEqual(2);
  });
});
