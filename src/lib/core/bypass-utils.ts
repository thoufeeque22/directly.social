/**
 * Centralized utility to determine if rate limiting should be bypassed.
 * Consolidates environment checks for E2E, Test, and local dev scenarios.
 */
export function shouldBypassRateLimit(): boolean {
  return (
    process.env.NEXT_PUBLIC_E2E === 'true' ||
    process.env.NODE_ENV === 'test' ||
    process.env.CI === 'true' ||
    process.env.VITEST === 'true' ||
    !process.env.UPSTASH_REDIS_REST_URL
  );
}
