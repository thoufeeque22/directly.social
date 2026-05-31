import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

/**
 * Global rate limiter: 10 requests per 10 seconds.
 * Base protection against basic automated abuse.
 */
export const globalRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "ratelimit:global",
});

/**
 * AI Generation rate limiter: 5 requests per 60 seconds.
 * Protects high-cost AI endpoints.
 */
export const aiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
  prefix: "ratelimit:ai",
});

/**
 * Upload rate limiter: 3 requests per 60 seconds.
 * Prevents storage abuse and bandwidth saturation.
 */
export const uploadRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  analytics: true,
  prefix: "ratelimit:upload",
});
