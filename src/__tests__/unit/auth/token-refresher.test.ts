import { describe, it, expect, vi, beforeEach } from 'vitest';
import { refreshTokenIfNecessary } from '@/lib/auth/token-refresher';
import { prisma } from '@/lib/core/prisma';
import { type Account } from '@prisma/client';
import { getPlatformCredentials } from '@/lib/core/credential-provider';
import { refreshGoogleToken } from '@/lib/auth/providers/google';
import { refreshTikTokToken } from '@/lib/auth/providers/tiktok';

vi.mock('@/lib/core/prisma', () => ({
  prisma: {
    account: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/core/credential-provider', () => ({
  getPlatformCredentials: vi.fn(),
}));

vi.mock('@/lib/auth/providers/google', () => ({
  refreshGoogleToken: vi.fn(),
}));

vi.mock('@/lib/auth/providers/tiktok', () => ({
  refreshTikTokToken: vi.fn(),
}));

describe('Token Refresher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not refresh if account not found', async () => {
    vi.mocked(prisma.account.findUnique).mockResolvedValue(null);
    const result = await refreshTokenIfNecessary('non-existent');
    expect(result).toBe(false);
  });

  it('should not refresh if no refresh token and not FB/IG', async () => {
    vi.mocked(prisma.account.findUnique).mockResolvedValue({
      id: 'acc-1',
      provider: 'google',
      refresh_token: null,
    } as unknown as Account);
    const result = await refreshTokenIfNecessary('acc-1');
    expect(result).toBe(false);
  });

  it('should not refresh if token is still valid (> 15 mins)', async () => {
    const farFuture = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    vi.mocked(prisma.account.findUnique).mockResolvedValue({
      id: 'acc-1',
      provider: 'google',
      refresh_token: 'ref-123',
      expires_at: farFuture,
    } as unknown as Account);
    const result = await refreshTokenIfNecessary('acc-1');
    expect(result).toBe(false);
    expect(refreshGoogleToken).not.toHaveBeenCalled();
  });

  it('should refresh Google token if expired', async () => {
    const past = Math.floor(Date.now() / 1000) - 3600;
    vi.mocked(prisma.account.findUnique).mockResolvedValue({
      id: 'acc-1',
      userId: 'user-1',
      provider: 'google',
      refresh_token: 'ref-123',
      expires_at: past,
    } as unknown as Account);
    vi.mocked(getPlatformCredentials).mockResolvedValue({ clientId: 'id', clientSecret: 'secret' });
    vi.mocked(refreshGoogleToken).mockResolvedValue({
      access_token: 'new-acc-123',
      refresh_token: 'new-ref-123',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    });

    const result = await refreshTokenIfNecessary('acc-1');
    
    expect(result).toBe(true);
    expect(refreshGoogleToken).toHaveBeenCalledWith('ref-123', { clientId: 'id', clientSecret: 'secret' });
    expect(prisma.account.update).toHaveBeenCalledWith({
      where: { id: 'acc-1' },
      data: {
        access_token: 'new-acc-123',
        refresh_token: 'new-ref-123',
        expires_at: expect.any(Number),
      },
    });
  });

  it('should refresh TikTok token if expiring soon', async () => {
    const soon = Math.floor(Date.now() / 1000) + 300; // 5 mins from now
    vi.mocked(prisma.account.findUnique).mockResolvedValue({
      id: 'acc-2',
      userId: 'user-2',
      provider: 'tiktok',
      refresh_token: 'ref-456',
      expires_at: soon,
    } as unknown as Account);
    vi.mocked(getPlatformCredentials).mockResolvedValue({ clientId: 'id', clientSecret: 'secret' });
    vi.mocked(refreshTikTokToken).mockResolvedValue({
      access_token: 'new-acc-456',
      refresh_token: 'new-ref-456',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    });

    const result = await refreshTokenIfNecessary('acc-2');
    
    expect(result).toBe(true);
    expect(refreshTikTokToken).toHaveBeenCalled();
    expect(prisma.account.update).toHaveBeenCalled();
  });
});
