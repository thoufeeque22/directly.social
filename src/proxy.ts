import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { applyRateLimit } from '@/lib/core/rate-limit-middleware';

const { auth } = NextAuth(authConfig);

/**
 * Unified Middleware for Authentication, Rate Limiting, and Routing.
 * (Next.js only supports one middleware file).
 */
export default auth(async (req) => {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const hostname = req.headers.get("host") || "";

  // 1. Rate Limiting for API routes
  const rateLimitResponse = await applyRateLimit(req, pathname, req.auth?.user?.id);
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Exclude common static/api paths from rewrites
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/static") ||
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/auth") ||
    url.pathname.startsWith("/monitoring")
  ) {
    return NextResponse.next();
  }

  // 3. Subdomain detection
  const isApp = hostname.startsWith("app.") || hostname.startsWith("staging.app.");
  const isMarketing = !isApp;
  
  // Vercel Preview Deployments handling
  const isVercelPreview = hostname.endsWith('.vercel.app');

  // 4. CTA Routing
  if ((isMarketing || (isVercelPreview && url.searchParams.get('site') === 'marketing')) && url.pathname === "/signup") {
     return NextResponse.redirect(new URL("https://app.directly.social/login", req.url));
  }

  // 5. Rewrite rules to respective folders
  
  // Guard against infinite rewrite loops (prevents HTTP 431)
  if (url.pathname.startsWith('/app/') || url.pathname === '/app' || 
      url.pathname.startsWith('/marketing/') || url.pathname === '/marketing') {
    return NextResponse.next();
  }

  if (isApp || (isVercelPreview && url.searchParams.get('site') !== 'marketing')) {
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = url.pathname === '/' ? '/app' : `/app${url.pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  if (isMarketing || (isVercelPreview && url.searchParams.get('site') === 'marketing')) {
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = url.pathname === '/' ? '/marketing' : `/marketing${url.pathname}`;
    return NextResponse.rewrite(rewriteUrl);
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
