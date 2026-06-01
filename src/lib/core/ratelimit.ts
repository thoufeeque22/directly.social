import { Ratelimit } from "@upstash/ratelimit";
import { shouldBypassRateLimit } from "./bypass-utils";

/**
 * Utility to check rate limit and throw if exceeded.
 * (OO-002): Now uses centralized bypass logic.
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string,
  errorMessage: string = "Too many requests. Please try again later."
) {
  if (shouldBypassRateLimit()) {
    return;
  }

  const { success } = await limiter.limit(identifier);
  if (!success) {
    throw new Error(errorMessage);
  }
}
