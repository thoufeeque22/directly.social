import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { applyRateLimit } from '@/lib/core/rate-limit-middleware';

/**
 * Unified Middleware for Authentication, Rate Limiting, and Routing.
 */
export async function proxy(req: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key',
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request: req,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Retrieve user session (if any)
  let user = null;
  if (process.env.NEXT_PUBLIC_E2E === 'true' && req.cookies.get('e2e-bypass')?.value === 'true') {
    user = { id: 'e2e-test-user-id' };
  } else if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://mock.supabase.co') {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const url = req.nextUrl;
  const pathname = url.pathname;
  const hostname = req.headers.get("host") || "";

  // 1. Rate Limiting for API routes
  const rateLimitResponse = await applyRateLimit(req, pathname, user?.id);
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Exclude common static/api paths from rewrites
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/monitoring")
  ) {
    return supabaseResponse;
  }

  // 3. Subdomain detection
  const isApp = hostname.startsWith("app.") || hostname.startsWith("staging.app.");
  const isMarketing = !isApp;
  const isVercelPreview = hostname.endsWith('.vercel.app');

  // 4. CTA Routing
  if ((isMarketing || (isVercelPreview && url.searchParams.get('site') === 'marketing')) && pathname === "/signup") {
    return NextResponse.redirect(new URL("https://app.directly.social/login", req.url));
  }

  // Guard against infinite rewrite loops
  if (pathname.startsWith('/app/') || pathname === '/app' || 
      pathname.startsWith('/marketing/') || pathname === '/marketing') {
    return supabaseResponse;
  }

  if (isApp || (isVercelPreview && url.searchParams.get('site') !== 'marketing')) {
    return supabaseResponse;
  }

  if (isMarketing || (isVercelPreview && url.searchParams.get('site') === 'marketing')) {
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = pathname === '/' ? '/marketing' : `/marketing${pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
