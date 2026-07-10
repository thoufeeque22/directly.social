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
 * Protects standard upload and media routes from abuse.
 */
export const uploadRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  analytics: true,
  prefix: "ratelimit:upload",
});

/**
 * Chunk streaming rate limiter: 120 requests per 60 seconds.
 * Allows rapid sequential chunks while capping abuse.
 */
export const chunkRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(120, "60 s"),
  analytics: true,
  prefix: "ratelimit:chunk",
});

/**
 * Authentication rate limiter: 5 attempts per 5 minutes.
 * Protects against brute-force attacks.
 */
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "5 m"),
  analytics: true,
  prefix: "ratelimit:auth",
});

/**
 * Sensitive metadata rate limiter: 5 requests per 60 seconds.
 * Protects platform-proxy and validation endpoints.
 */
export const sensitiveRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
  prefix: "ratelimit:sensitive",
});

/**
 * Support request rate limiter: 3 requests per 60 seconds.
 */
export const supportRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  analytics: true,
  prefix: "ratelimit:support",
});
