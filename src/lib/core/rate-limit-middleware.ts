import { NextResponse } from 'next/server';
import { shouldBypassRateLimit } from '@/lib/core/bypass-utils';
import { getLimiterForPath } from '@/lib/core/rate-limit-registry';

export async function applyRateLimit(req: Request, pathname: string, userId?: string): Promise<NextResponse | null> {
  // 1. Rate Limiting for API routes
  if (!pathname.startsWith('/api')) {
    return null;
  }

  // Centralized bypass logic
  if (shouldBypassRateLimit() || process.env.NEXT_PUBLIC_E2E === 'true' || process.env.NODE_ENV !== 'production' || !process.env.UPSTASH_REDIS_REST_URL) {
    return null;
  }

  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = (req as Request & { ip?: string }).ip ?? forwardedFor?.split(',')[0] ?? realIp ?? '127.0.0.1';

    const { limiter, useIpOnly, getDynamicIdentifier } = getLimiterForPath(pathname);
    let identifier = useIpOnly ? ip : (userId ?? ip);
    if (getDynamicIdentifier) {
      identifier = getDynamicIdentifier(pathname, identifier);
    }

    const limitResult = await limiter.limit(identifier);

    if (!limitResult.success) {
      // Handle browser navigation requests gracefully (e.g., OAuth callbacks)
      if (req.headers.get('accept')?.includes('text/html')) {
        const redirectUrl = new URL('/login?error=RateLimit', req.url);
        return NextResponse.redirect(redirectUrl);
      }

      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': limitResult.reset.toString(),
          },
        }
      );
    }
  } catch (error) {
    // Fail-open: ensure API remains accessible if Redis/Ratelimit fails
    console.error('Rate limiting middleware error:', error);
  }

  return null;
}
