import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { YouTubeActivity } from '@/lib/platforms/youtube-activity';
import { getYouTubeClient } from '@/lib/platforms/youtube/account';
import { initYouTubeSession } from '@/lib/platforms/youtube/session';
import { pushYouTubeBinary } from '@/lib/platforms/youtube/push';
import { StorageProvider } from '@/lib/platforms/types';

vi.mock('@/lib/platforms/youtube/account');
vi.mock('@/lib/platforms/youtube/session');
vi.mock('@/lib/platforms/youtube/push');

describe('YouTubeActivity', () => {
  let activity: YouTubeActivity;
  let mockStorage: StorageProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage = {
      resolvePath: vi.fn(),
      getFileSize: vi.fn().mockResolvedValue(1000)
    };
    activity = new YouTubeActivity();
  });

  const baseParams = {
    userId: 'u1',
    activityId: 'a1',
    platform: 'youtube',
    accountId: 'acc1'
  };

  it('preVerify calls getYouTubeClient', async () => {
    await activity.preVerify(baseParams);
    expect(getYouTubeClient).toHaveBeenCalledWith('u1', 'acc1');
  });

  it('init calls initYouTubeSession', async () => {
    (getYouTubeClient as Mock).mockResolvedValue({});
    (initYouTubeSession as Mock).mockResolvedValue('url-123');

    const res = await activity.init({
      ...baseParams,
      title: 'T',
      description: 'D',
      videoFormat: 'short',
      filePath: '/path',
      storage: mockStorage
    });

    expect(initYouTubeSession).toHaveBeenCalled();
    expect(res).toEqual({ creationId: 'url-123', resumableUrl: 'url-123' });
  });

  it('push calls pushYouTubeBinary', async () => {
    (pushYouTubeBinary as Mock).mockResolvedValue({ id: 'v123' });
    global.fetch = vi.fn().mockResolvedValue({ status: 308, headers: { get: () => 'bytes=0-499' } });

    const res = await activity.push({
      ...baseParams,
      title: 'T',
      description: 'D',
      videoFormat: 'short',
      filePath: '/path',
      storage: mockStorage,
      creationId: 'url-123'
    });

    expect(pushYouTubeBinary).toHaveBeenCalled();
    expect(res).toEqual({ resumableUrl: 'url-123', platformPostId: 'v123' });
  });
});
