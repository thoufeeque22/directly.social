/**
 * TIKTOK PLATFORM TESTS
 * Unit tests for the TikTok publishing logic.
 * Focuses on:
 * - Proper initialization with the TikTok Open API.
 * - Accurate construction of binary upload payloads and headers.
 * - Handling of TikTok-specific error codes (e.g., rate limits).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { publishTikTokVideo } from '@/lib/platforms/tiktok';
import { prisma } from '@/lib/core/prisma';


// Mock Prisma
vi.mock('@/lib/core/prisma', () => ({
  prisma: {
    account: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
    byokCredential: {
      findUnique: vi.fn().mockResolvedValue(null),
    },
    logTokenEvent: {
      create: vi.fn().mockResolvedValue({}),
    }
  },
}));

// Mock Audit
vi.mock('@/lib/core/audit', () => ({
  logTokenEvent: vi.fn().mockResolvedValue({}),
}));

// Mock FS
vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn().mockResolvedValue(Buffer.from('video_data')),
    stat: vi.fn().mockResolvedValue({ size: 1024 }),
  },
  createReadStream: vi.fn().mockReturnValue(Buffer.from('video_data')),
  default: {
    promises: {
      readFile: vi.fn().mockResolvedValue(Buffer.from('video_data')),
      stat: vi.fn().mockResolvedValue({ size: 1024 }),
    },
    createReadStream: vi.fn().mockReturnValue(Buffer.from('video_data')),
  }
}));

global.fetch = vi.fn();

describe('TikTok Platform Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('correctly initializes and uploads a video to TikTok with dynamic privacy', async () => {
    // 1. Mock DB Account
    vi.mocked(prisma.account.findUnique).mockResolvedValue({
      id: 'acc1',
      access_token: 'tk_token_123',
    } as never);

    // 2. Mock TikTok API Init
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { upload_url: 'https://tiktok.com/upload/binary', publish_id: 'p1' },
        error: { code: 'ok' }
      }),
    } as Response);

    // 3. Mock TikTok Binary Upload
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
    } as Response);

    const result = await publishTikTokVideo({
      userId: 'user1',
      filePath: 'test.mp4',
      title: 'TikTok Viral',
      accountId: 'acc1',
      privacy: 'PUBLIC_TO_EVERYONE'
    });

    expect(result.publish_id).toBe('p1');
    
    // Verify initialization payload
    const initCall = vi.mocked(global.fetch).mock.calls[0];
    const payload = JSON.parse(initCall[1]?.body as string);
    expect(payload.post_info.title).toBe('TikTok Viral');
    expect(payload.post_info.privacy_level).toBe('PUBLIC_TO_EVERYONE');

    // Verify binary upload headers
    const uploadCall = vi.mocked(global.fetch).mock.calls[1];
    expect(uploadCall[0]).toBe('https://tiktok.com/upload/binary');
  });

  it('throws error if TikTok init fails', async () => {
    vi.mocked(prisma.account.findUnique).mockResolvedValue({ access_token: 'abc' } as never);
    
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        error: { code: 'failed', message: 'Rate limit' }
      }),
    } as Response);

    await expect(publishTikTokVideo({ userId: 'u1', filePath: 'v.mp4', title: 'T', accountId: 'a1' }))
      .rejects.toThrow('TikTok Init Failed: Rate limit');
  });
});
