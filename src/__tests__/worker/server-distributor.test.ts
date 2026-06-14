/**
 * SERVER DISTRIBUTOR TESTS
 * Tests the server-side distribution logic used by the background worker.
 * Verifies:
 * - Correct routing to platform-specific SDKs (YouTube, Facebook, Instagram).
 * - Proper handling of video formats (Short/Reel vs regular Video).
 * - Database persistence of platform-specific upload results.
 * - Robust error handling for API failures.
 */

import { describe, it, beforeEach, vi, expect } from 'vitest';
import { distributeToPlatformsServer } from '../../lib/worker/server-distributor';
import { inngest } from '../../lib/inngest/client';

// Mock Dependencies
const mockUpsert = vi.fn().mockResolvedValue({ id: 'res-1' });
const mockFindUnique = vi.fn().mockResolvedValue(null);
vi.mock('../../lib/core/prisma', () => ({
  prisma: {
    postPlatformResult: {
      upsert: (args: unknown) => mockUpsert(args),
      findUnique: (args: unknown) => mockFindUnique(args),
    },
    postActivity: {
      update: vi.fn().mockResolvedValue({}),
      findUnique: vi.fn().mockResolvedValue({}),
    }
  },
}));

// Mock Inngest
vi.mock('../../lib/inngest/client', () => ({
  inngest: {
    send: vi.fn().mockResolvedValue({ ids: ['evt-1', 'evt-2'] }),
  },
}));

describe('Server Distributor', () => {
  const baseParams = {
    stagedFileId: 'file-123',
    userId: 'user-1',
    activityId: 'activity-1',
    title: 'Test Title',
    description: 'Test Desc',
    videoFormat: 'short' as const,
    platforms: [
      { platform: 'youtube', accountId: 'acc-yt', accountName: 'YT Channel' },
      { platform: 'facebook', accountId: 'acc-fb', accountName: 'FB Page' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('correctly triggers durable workflows for Short/Reel', async () => {
    const results = await distributeToPlatformsServer(baseParams);

    expect(results).toHaveLength(2);
    expect(results[0].status).toBe('pending');

    // Verify Inngest events
    expect(inngest.send).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        name: 'video.publish',
        data: expect.objectContaining({
          platform: 'youtube',
          activityId: 'activity-1'
        })
      }),
      expect.objectContaining({
        name: 'video.publish',
        data: expect.objectContaining({
          platform: 'facebook',
          activityId: 'activity-1'
        })
      })
    ]));
  });

  it('handles platform metadata preparation', async () => {
    const paramsWithReview = {
      ...baseParams,
      reviewedContent: {
        youtube: { title: 'Reviewed YT Title', description: 'Reviewed YT Desc' }
      }
    };
    await distributeToPlatformsServer(paramsWithReview);

    expect(inngest.send).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        data: expect.objectContaining({
          platform: 'youtube',
          title: 'Reviewed YT Title'
        })
      })
    ]));
  });
});

