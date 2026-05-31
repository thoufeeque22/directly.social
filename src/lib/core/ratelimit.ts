import { Ratelimit } from "@upstash/ratelimit";

/**
 * Utility to check rate limit and throw if exceeded.
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string,
  errorMessage: string = "Too many requests. Please try again later."
) {
  // Skip rate limiting in E2E/test environments
  if (
    process.env.NEXT_PUBLIC_E2E === 'true' || 
    process.env.NODE_ENV === 'test' || 
    process.env.CI === 'true' ||
    process.env.VITEST === 'true'
  ) {
    return;
  }

  // Skip rate limiting if environment variables are not set (e.g. local dev without Upstash)
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return;
  }

  const { success } = await limiter.limit(identifier);
  if (!success) {
    throw new Error(errorMessage);
  }
}
