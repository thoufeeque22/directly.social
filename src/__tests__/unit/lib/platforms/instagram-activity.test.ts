import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { InstagramActivity } from '@/lib/platforms/instagram-activity';
import { InstagramClient } from '@/lib/platforms/instagram/client';
import { StorageProvider } from '@/lib/platforms/types';

describe('InstagramActivity', () => {
  let activity: InstagramActivity;
  let mockClient: Mocked<InstagramClient>;
  let mockStorage: StorageProvider;

  beforeEach(() => {
    mockClient = {
      getAccount: vi.fn().mockResolvedValue({ igUserId: 'ig-123', userAccessToken: 'token-123' }),
      createContainer: vi.fn().mockResolvedValue('container-123'),
      fetchUploadOffset: vi.fn().mockResolvedValue(0),
      pushBinary: vi.fn().mockResolvedValue(undefined),
      pollStatus: vi.fn().mockResolvedValue(undefined),
      finalize: vi.fn().mockResolvedValue('media-123'),
      getPermalink: vi.fn().mockResolvedValue('https://instagr.am/p/media-123')
    } as unknown as Mocked<InstagramClient>;
    mockStorage = {
      resolvePath: vi.fn(),
      getFileSize: vi.fn().mockResolvedValue(1000)
    };
    activity = new InstagramActivity(mockClient as unknown as InstagramClient);
  });

  const baseParams = {
    userId: 'u1',
    activityId: 'a1',
    platform: 'instagram',
    accountId: 'acc1'
  };

  it('preVerify calls getAccount', async () => {
    await activity.preVerify(baseParams);
    expect(mockClient.getAccount).toHaveBeenCalledWith('u1', 'acc1');
  });

  it('init calls createContainer', async () => {
    const res = await activity.init({
      ...baseParams,
      title: 'T',
      description: 'D',
      videoFormat: 'short',
      filePath: '/path',
      storage: mockStorage
    });
    expect(mockClient.getAccount).toHaveBeenCalledWith('u1', 'acc1');
    expect(mockClient.createContainer).toHaveBeenCalledWith('ig-123', 'token-123', 'D');
    expect(res).toEqual({ creationId: 'container-123' });
  });

  it('push calls pushBinary', async () => {
    const onProgress = vi.fn();
    const res = await activity.push({
      ...baseParams,
      title: 'T',
      description: 'D',
      videoFormat: 'short',
      filePath: '/path',
      storage: mockStorage,
      creationId: 'container-123',
      onProgress
    });
    expect(mockClient.fetchUploadOffset).toHaveBeenCalledWith('container-123', 'token-123');
    expect(mockClient.pushBinary).toHaveBeenCalledWith(
      'container-123', '/path', 'token-123', 0, onProgress
    );
    expect(res.resumableUrl).toContain('container-123');
  });

  it('poll calls pollStatus', async () => {
    await activity.poll({ ...baseParams, creationId: 'container-123' });
    expect(mockClient.pollStatus).toHaveBeenCalledWith('container-123', 'token-123');
  });

  it('finalize calls finalize and getPermalink', async () => {
    const res = await activity.finalize({
      ...baseParams,
      creationId: 'container-123',
      title: 'T',
      description: 'D'
    });
    expect(mockClient.finalize).toHaveBeenCalledWith('ig-123', 'container-123', 'token-123');
    expect(mockClient.getPermalink).toHaveBeenCalledWith('media-123', 'token-123');
    expect(res).toEqual({ id: 'media-123', permalink: 'https://instagr.am/p/media-123' });
  });
});
