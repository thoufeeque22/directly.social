import {
  aiRateLimit,
  uploadRateLimit,
  chunkRateLimit,
  authRateLimit,
  sensitiveRateLimit,
  globalRateLimit,
} from './ratelimit-config';
import { Ratelimit } from '@upstash/ratelimit';

export interface RateLimitRoute {
  pattern: RegExp;
  limiter: Ratelimit;
  useIpOnly?: boolean;
}

/**
 * Registry mapping API path patterns to their respective rate limiters.
 * (CA-003): Decouples middleware from specific route paths.
 */
export const rateLimitRegistry: RateLimitRoute[] = [
  {
    pattern: /^\/api\/ai\//,
    limiter: aiRateLimit,
  },
  {
    pattern: /^\/api\/upload\/chunk\//,
    limiter: chunkRateLimit,
  },
  {
    pattern: /^\/api\/(upload|media)\//,
    limiter: uploadRateLimit,
  },
  {
    pattern: /^\/api\/auth\/(signin|verify-request)/,
    limiter: authRateLimit,
    useIpOnly: true,
  },
  {
    pattern: /^\/api\/(tiktok-proxy|validate-key)/,
    limiter: sensitiveRateLimit,
  },
];

/**
 * Finds the appropriate limiter for a given path, falling back to global.
 */
export function getLimiterForPath(pathname: string): RateLimitRoute {
  const match = rateLimitRegistry.find((r) => r.pattern.test(pathname));
  return match ?? { pattern: /^\/api\//, limiter: globalRateLimit };
}
