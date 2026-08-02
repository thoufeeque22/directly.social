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
  if (process.env.E2E_TEST_MODE === 'true' && req.cookies.get('e2e-bypass')?.value === 'true') {
    user = { id: 'e2e-test-user-id' };
  } else if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://mock.supabase.co') {
    const isProtected = ['/settings', '/activity', '/media', '/admin', '/app', '/schedule'].some(prefix => req.nextUrl.pathname.startsWith(prefix));
    if (isProtected) {
      const { data } = await supabase.auth.getUser();
      user = data?.user;
    }
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
    pathname.startsWith("/monitoring")
  ) {
    return supabaseResponse;
  }

  // 3. Subdomain detection
  const isApp = hostname.startsWith("app.") || hostname.startsWith("staging.app.") || hostname.startsWith("app.localhost");
  const isMarketing = !isApp;
  const isVercelPreview = hostname.endsWith('.vercel.app');

  // Force login and auth to happen on the app subdomain to prevent cookie fragmentation
  if (isMarketing && (pathname.startsWith("/login") || pathname.startsWith("/auth"))) {
    const appHostname = hostname.includes('localhost') 
      ? `app.localhost:${url.port || 3000}` 
      : hostname.startsWith('staging.') ? `app.staging.directly.social` : `app.directly.social`;
    return NextResponse.redirect(new URL(pathname + url.search, `http${hostname.includes('localhost') ? '' : 's'}://${appHostname}`));
  }

  // If we are on the app subdomain, allow /login and /auth to proceed normally
  if (isApp && (pathname.startsWith("/login") || pathname.startsWith("/auth"))) {
    return supabaseResponse;
  }

  // 4. CTA Routing
  if ((isMarketing || (isVercelPreview && url.searchParams.get('site') === 'marketing')) && pathname === "/signup") {
    const appHostname = hostname.includes('localhost') 
      ? `app.localhost:${url.port || 3000}` 
      : hostname.startsWith('staging.') ? `app.staging.directly.social` : `app.directly.social`;
    return NextResponse.redirect(new URL("/login", `http${hostname.includes('localhost') ? '' : 's'}://${appHostname}`));
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
