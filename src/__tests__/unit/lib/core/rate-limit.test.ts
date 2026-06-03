import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getLimiterForPath } from '@/lib/core/rate-limit-registry';
import { shouldBypassRateLimit } from '@/lib/core/bypass-utils';
import {
  aiRateLimit,
  uploadRateLimit,
  authRateLimit,
  sensitiveRateLimit,
  globalRateLimit,
} from '@/lib/core/ratelimit-config';

describe('Rate Limit Registry', () => {
  it('should match AI routes to aiRateLimit', () => {
    const route = getLimiterForPath('/api/ai/generate');
    expect(route.limiter).toBe(aiRateLimit);
  });

  it('should match upload and media routes to uploadRateLimit', () => {
    expect(getLimiterForPath('/api/upload/video').limiter).toBe(uploadRateLimit);
    expect(getLimiterForPath('/api/media/image').limiter).toBe(uploadRateLimit);
  });

  it('should match auth routes to authRateLimit', () => {
    const route = getLimiterForPath('/api/auth/session');
    expect(route.limiter).toBe(authRateLimit);
    expect(route.useIpOnly).toBe(true);
  });

  it('should match sensitive proxy routes to sensitiveRateLimit', () => {
    expect(getLimiterForPath('/api/tiktok-proxy').limiter).toBe(sensitiveRateLimit);
    expect(getLimiterForPath('/api/validate-key').limiter).toBe(sensitiveRateLimit);
  });

  it('should fallback to globalRateLimit for other /api routes', () => {
    const route = getLimiterForPath('/api/users/profile');
    expect(route.limiter).toBe(globalRateLimit);
  });
});

describe('Bypass Utils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should bypass if NEXT_PUBLIC_E2E is true', () => {
    process.env.NEXT_PUBLIC_E2E = 'true';
    expect(shouldBypassRateLimit()).toBe(true);
  });

  it('should bypass in test environment', () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'test';
    expect(shouldBypassRateLimit()).toBe(true);
  });

  it('should bypass in CI', () => {
    process.env.CI = 'true';
    expect(shouldBypassRateLimit()).toBe(true);
  });

  it('should bypass if Redis URL is missing', () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    expect(shouldBypassRateLimit()).toBe(true);
  });

  it('should NOT bypass in production with Redis URL configured', () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_E2E = 'false';
    process.env.CI = 'false';
    process.env.VITEST = undefined;
    process.env.UPSTASH_REDIS_REST_URL = 'https://mock-redis.com';
    
    // We need to re-import or use a fresh check because of how it might be cached
    // but the function itself just reads process.env directly
    expect(shouldBypassRateLimit()).toBe(false);
  });
});
