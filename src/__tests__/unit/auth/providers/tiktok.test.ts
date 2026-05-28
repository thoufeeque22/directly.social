import { describe, it, expect, vi } from 'vitest';
import { refreshTikTokToken } from '@/lib/auth/providers/tiktok';
import axios from 'axios';

vi.mock('axios');

describe('TikTok Token Provider', () => {
  it('should refresh tiktok token successfully', async () => {
    vi.mocked(axios.post).mockResolvedValue({
      data: {
        access_token: 'at-123',
        refresh_token: 'rt-123',
        expires_in: 3600,
      },
    });

    const creds = { clientId: 'id', clientSecret: 'secret' };
    const result = await refreshTikTokToken('old-rt', creds);

    expect(result.access_token).toBe('at-123');
    expect(result.refresh_token).toBe('rt-123');
    expect(result.expires_at).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('should throw error on TikTok API error', async () => {
    vi.mocked(axios.post).mockResolvedValue({
      data: {
        error: 'invalid_grant',
        error_description: 'Refresh token expired',
      },
    });

    const creds = { clientId: 'id', clientSecret: 'secret' };
    await expect(refreshTikTokToken('old-rt', creds)).rejects.toThrow('TikTok error: Refresh token expired');
  });
});
