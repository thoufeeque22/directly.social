import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { shouldBypassRateLimit } from '@/lib/core/bypass-utils';
import { getLimiterForPath } from '@/lib/core/rate-limit-registry';

/**
 * Unified Middleware for Authentication and Rate Limiting.
 * (Next.js only supports one middleware file).
 */
export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;
  const nextReq = req as unknown as NextRequest;

  // 1. Rate Limiting for API routes
  if (pathname.startsWith('/api')) {
    // (OO-002): Centralized bypass logic
    if (shouldBypassRateLimit()) {
      return NextResponse.next();
    }

    try {
      const userId = req.auth?.user?.id;
      // Use a safer access pattern for IP to satisfy the compiler
      const ip = (req as Request & { ip?: string }).ip ?? '127.0.0.1';

      // (CA-003): Use registry to find appropriate limiter
      const { limiter, useIpOnly } = getLimiterForPath(pathname);
      const identifier = useIpOnly ? ip : (userId ?? ip);

      const limitResult = await limiter.limit(identifier);

      if (!limitResult.success) {
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
  }

  // Continue to next middleware or route handler
  return NextResponse.next();
});

export const config = {
  /**
   * Combined matcher: cover API and all pages (excluding static assets).
   * This replaces the logic from both src/proxy.ts and the previous src/middleware.ts.
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
