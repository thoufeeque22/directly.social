import {
  aiRateLimit,
  storageRateLimit,
  platformRateLimit,
  localPlatformRateLimit,
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
  getDynamicIdentifier?: (pathname: string, baseIdentifier: string) => string;
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
    pattern: /^\/api\/upload\/presigned-url/,
    limiter: storageRateLimit,
  },
  {
    pattern: /^\/api\/upload\/local/,
    limiter: localPlatformRateLimit,
  },
  {
    pattern: /^\/api\/upload\/(youtube|tiktok|facebook|instagram|local)/i,
    limiter: platformRateLimit,
    getDynamicIdentifier: (pathname, baseId) => {
      const platform = pathname.split('/')[3] || 'unknown';
      return `${platform}:${baseId}`;
    }
  },
  {
    pattern: /^\/api\/(upload|media)\//,
    limiter: storageRateLimit, // Fallback for other media/upload endpoints
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
