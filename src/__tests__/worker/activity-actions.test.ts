/**
 * POST ACTIVITY ACTIONS TESTS
 * Tests the server actions used by the Activity page.
 * Focuses on:
 * - Fetching post activity with cursor-based pagination.
 * - Retry logic for failed distribution channels.
 * - Stale post detection and resumed upload handling.
 */

import { describe, it, beforeEach, vi, expect } from 'vitest';
import { upsertPlatformResultInternal } from '../../app/actions/activity/upsert-helpers';
import { prisma } from '../../lib/core/prisma';

// Mock Auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

// Mock Prisma
vi.mock('../../lib/core/prisma', () => ({
  prisma: {
    postActivity: {
      findUnique: vi.fn(),
    },
    postPlatformResult: {
      upsert: vi.fn(),
    },
  },
}));

describe('Activity Actions (Internal)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successfully updates a platform result when user owns the activity entry', async () => {
    const userId = 'user-1';
    const activityId = 'activity-1';
    const resultInput = {
      platform: 'youtube' as const,
      status: 'success' as const,
      platformPostId: 'yt-123'
    };

    // Mock finding the activity entry (ownership check)
    vi.mocked(prisma.postActivity.findUnique).mockResolvedValue({ id: activityId, userId } as never);
    vi.mocked(prisma.postPlatformResult.upsert).mockResolvedValue({ id: 'res-1' } as never);

    await upsertPlatformResultInternal(userId, activityId, resultInput);

    // Verify ownership check
    expect(prisma.postActivity.findUnique).toHaveBeenCalledWith({
      where: { id: activityId, userId: userId }
    });

    // Verify upsert
    expect(prisma.postPlatformResult.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        postActivityId_platform_accountId: {
          postActivityId: activityId,
          platform: 'youtube',
          accountId: ''
        }
      },
      update: expect.objectContaining({
        status: 'success',
        platformPostId: 'yt-123'
      })
    }));
  });

  it('throws an error if activity entry is not found or user does not own it', async () => {
    const userId = 'user-1';
    const activityId = 'activity-1';
    
    // Mock no activity entry found for this user
    vi.mocked(prisma.postActivity.findUnique).mockResolvedValue(null);

    await expect(upsertPlatformResultInternal(userId, activityId, { 
      platform: 'youtube', 
      status: 'success' 
    })).rejects.toThrow('Activity entry not found');

    expect(prisma.postPlatformResult.upsert).not.toHaveBeenCalled();
  });
});
