import { describe, it, expect, vi, beforeEach, Mocked, Mock } from 'vitest';
import { videoPublishingHandler } from '@/lib/inngest/functions/video-publishing';
import { getPlatformActivity } from '@/lib/platforms/factory';
import { getRepository, getStorage } from '@/lib/infrastructure';
import { PlatformActivity, PublishingRepository, StorageProvider, PushParams } from '@/lib/platforms/types';

vi.mock('@/lib/platforms/factory');
vi.mock('@/lib/infrastructure');

describe('videoPublishingHandler', () => {
  let mockActivity: Mocked<PlatformActivity>;
  let mockRepository: Mocked<PublishingRepository>;
  let mockStorage: Mocked<StorageProvider>;
  let mockStep: { run: Mock };

  beforeEach(() => {
    vi.clearAllMocks();

    mockActivity = {
      preVerify: vi.fn(),
      init: vi.fn().mockResolvedValue({ creationId: 'c1', resumableUrl: 'url1' }),
      push: vi.fn().mockResolvedValue({ platformPostId: 'post1' }),
      poll: vi.fn(),
      finalize: vi.fn().mockResolvedValue({ id: 'f1', permalink: 'p1' }),
    } as unknown as Mocked<PlatformActivity>;

    mockRepository = {
      fetchState: vi.fn(),
      upsertState: vi.fn(),
      updateProgress: vi.fn(),
    } as unknown as Mocked<PublishingRepository>;

    mockStorage = {
      resolvePath: vi.fn().mockResolvedValue('/resolved/path'),
      getFileSize: vi.fn().mockResolvedValue(1000),
    } as unknown as Mocked<StorageProvider>;

    (getPlatformActivity as Mock).mockReturnValue(mockActivity);
    (getRepository as Mock).mockReturnValue(mockRepository);
    (getStorage as Mock).mockReturnValue(mockStorage);

    mockStep = {
      run: vi.fn().mockImplementation(async (_name: string, fn: () => Promise<unknown>) => await fn()),
    };
  });

  const mockEvent = {
    name: 'video.publish',
    data: {
      activityId: 'a1',
      platform: 'instagram',
      accountId: 'acc1',
      userId: 'u1',
      stagedFileId: 's1',
      title: 'T',
      description: 'D',
      videoFormat: 'short' as const,
    },
  };

  it('executes the full publishing workflow successfully', async () => {
    const result = await videoPublishingHandler({ 
      event: mockEvent as unknown as Parameters<typeof videoPublishingHandler>[0]['event'], 
      step: mockStep as unknown as Parameters<typeof videoPublishingHandler>[0]['step'] 
    });

    expect(mockStep.run).toHaveBeenCalledWith('resolve-video-path', expect.any(Function));
    expect(mockStep.run).toHaveBeenCalledWith('fetch-state', expect.any(Function));
    expect(mockStep.run).toHaveBeenCalledWith('pre-verify', expect.any(Function));
    expect(mockStep.run).toHaveBeenCalledWith('init', expect.any(Function));
    expect(mockStep.run).toHaveBeenCalledWith('push', expect.any(Function));
    expect(mockStep.run).toHaveBeenCalledWith('poll', expect.any(Function));
    expect(mockStep.run).toHaveBeenCalledWith('finalize', expect.any(Function));

    expect(mockActivity.preVerify).toHaveBeenCalled();
    expect(mockActivity.init).toHaveBeenCalled();
    expect(mockActivity.push).toHaveBeenCalled();
    expect(mockActivity.poll).toHaveBeenCalled();
    expect(mockActivity.finalize).toHaveBeenCalled();

    expect(mockRepository.upsertState).toHaveBeenCalledTimes(5);
    expect(result).toEqual({ id: 'f1', permalink: 'p1' });
  });

  it('throttles progress updates during push', async () => {
    // To test progress throttling, we need to capture the onProgress callback passed to push
    let capturedOnProgress: ((pct: number) => Promise<void>) | undefined;
    mockActivity.push.mockImplementation(async (params: PushParams) => {
      capturedOnProgress = params.onProgress;
      return { platformPostId: 'post1' };
    });

    await videoPublishingHandler({ 
      event: mockEvent as unknown as Parameters<typeof videoPublishingHandler>[0]['event'], 
      step: mockStep as unknown as Parameters<typeof videoPublishingHandler>[0]['step'] 
    });

    if (capturedOnProgress) {
      await capturedOnProgress(10); // First call
      await capturedOnProgress(20); // Fast second call - should be throttled
      
      // Wait > 2s
      vi.setSystemTime(Date.now() + 3000);
      await capturedOnProgress(30); // Should be allowed
      
      await capturedOnProgress(100); // Should always be allowed
    }

    expect(mockRepository.updateProgress).toHaveBeenCalledTimes(3); // 10, 30, 100
  });
});
