import { describe, it, expect, vi } from 'vitest';
import { refreshGoogleToken } from '@/lib/auth/providers/google';

const mockRefreshAccessToken = vi.fn().mockResolvedValue({
  credentials: {
    access_token: 'new-at',
    refresh_token: 'new-rt',
    expiry_date: 1234567890,
  },
});

vi.mock('googleapis', () => {
  return {
    google: {
      auth: {
        OAuth2: vi.fn().mockImplementation(function() {
          return {
            setCredentials: vi.fn(),
            refreshAccessToken: mockRefreshAccessToken,
          };
        }),
      },
    },
  };
});

describe('Google Token Provider', () => {
  it('should refresh google token successfully', async () => {
    const creds = { clientId: 'id', clientSecret: 'secret', redirectUri: 'uri' };
    const result = await refreshGoogleToken('old-rt', creds);

    expect(result).toEqual({
      access_token: 'new-at',
      refresh_token: 'new-rt',
      expires_at: 1234567,
    });
  });
});
