import { validateCredentials } from '../../../lib/byok/credential-validator';
import { describe, it, expect } from 'vitest';

describe('validateCredentials', () => {
  it('validates correct credentials', async () => {
    const result = await validateCredentials('YouTube', { clientId: 'valid', clientSecret: 'secret', redirectUri: 'https://app.com' });
    expect(result.success).toBe(true);
  });

  it('fails on invalid credentials', async () => {
    const result = await validateCredentials('YouTube', { clientId: 'invalid', clientSecret: 'secret', redirectUri: 'https://app.com' });
    expect(result.success).toBe(false);
  });
});
