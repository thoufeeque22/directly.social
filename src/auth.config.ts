/* eslint-disable max-lines */
import type { NextAuthConfig } from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import TikTok from "next-auth/providers/tiktok";
import LinkedIn from "next-auth/providers/linkedin";
import type { User } from "next-auth";

const cookieDomain = process.env.NODE_ENV === 'production' ? ".directly.social" : undefined;
const useSecureCookies = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_E2E !== 'true';

export default {
  useSecureCookies,
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: cookieDomain,
      },
    },
  },
  // ... rest of the config ...
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    ...(process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET ? [
      Facebook({
        clientId: process.env.AUTH_FACEBOOK_ID,
        clientSecret: process.env.AUTH_FACEBOOK_SECRET,
        authorization: {
          params: {
            scope: "email,public_profile,instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,pages_manage_posts",
            auth_type: "reauthenticate",
          },
        },
        allowDangerousEmailAccountLinking: true,
      })
    ] : []),
    ...(process.env.AUTH_TIKTOK_ID && process.env.AUTH_TIKTOK_SECRET ? [
      TikTok({
        clientId: process.env.AUTH_TIKTOK_ID,
        clientSecret: process.env.AUTH_TIKTOK_SECRET,
        authorization: {
          params: {
            scope: "user.info.basic,video.upload,video.publish",
            prompt: "select_account",
          },
        },
        client: {
          token_endpoint_auth_method: "client_secret_post",
        },
        token: {
          url: (process.env.AUTH_URL || process.env.NEXTAUTH_URL || "https://directly-social.vercel.app") + "/api/tiktok-proxy",
        },
        userinfo: {
          url: "https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name",
        },
        checks: ["state"],
        allowDangerousEmailAccountLinking: true,
      })
    ] : []),
    ...(process.env.AUTH_LINKEDIN_ID && process.env.AUTH_LINKEDIN_SECRET ? [
      LinkedIn({
        clientId: process.env.AUTH_LINKEDIN_ID,
        clientSecret: process.env.AUTH_LINKEDIN_SECRET,
        authorization: {
          params: {
            scope: "openid profile email w_member_social",
          }
        },
        allowDangerousEmailAccountLinking: true,
      })
    ] : []),
  ],
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Prevent cross-origin redirect to Tailscale tunnel during native E2E tests,
      // which causes iOS WKWebView to aggressively drop the Set-Cookie header.
      if (process.env.NEXT_PUBLIC_E2E === 'true') {
        const path = url.startsWith('http') ? new URL(url).pathname : url;
        return `http://127.0.0.1:3000${path}`;
      }

      // Fix Nginx proxy localhost leak on logout
      let fixedBaseUrl = baseUrl;
      if (process.env.NODE_ENV === 'production' && baseUrl.includes('localhost')) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://directly.social';
        fixedBaseUrl = siteUrl.includes('app.') ? siteUrl : siteUrl.replace('://', '://app.');
      }

      return url.startsWith("/") ? new URL(url, fixedBaseUrl).toString() : url;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.aiCredits = (user as User).aiCredits;
      }
      
      // Note: We removed the Prisma fetch here because auth.config.ts runs in Edge runtime.
      // Database lookups during session update are now handled securely in src/auth.ts
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
        session.user.aiCredits = token.aiCredits as number;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname === "/login";

      // Allow public marketing paths to be served without auth.
      // This prevents unauthenticated crawlers (e.g. Googlebot) on directly.social
      // from being redirected to /login → app.directly.social/login, which Google
      // reports as "Page with redirect" and refuses to index.
      const forwardedHostRaw = request.headers.get('x-forwarded-host');
      const realHostRaw = forwardedHostRaw ? forwardedHostRaw.split(':')[0] : nextUrl.hostname;
      const isMarketingDomain =
        realHostRaw === 'directly.social' ||
        realHostRaw === 'www.directly.social' ||
        // Vercel preview URLs without an explicit site=app param
        (realHostRaw.endsWith('.vercel.app') && nextUrl.searchParams.get('site') !== 'app');

      const PUBLIC_MARKETING_PATHS = [
        '/', '/docs', '/philosophy', '/privacy', '/terms',
        '/pricing', '/cookies', '/byok', '/referral-terms', '/status',
      ];
      const isPublicMarketingPath =
        PUBLIC_MARKETING_PATHS.includes(nextUrl.pathname) ||
        PUBLIC_MARKETING_PATHS.some(
          (p) => p !== '/' && nextUrl.pathname.startsWith(p + '/'),
        );

      if (isMarketingDomain && isPublicMarketingPath) {
        // Serve the marketing page transparently — proxy.ts will rewrite to /marketing
        return true;
      }

      if (isOnLogin) {
        const targetUrl = new URL("/", nextUrl);
        const forwardedHost = request.headers.get('x-forwarded-host');
        const hostHeader = request.headers.get('host') || '';
        const effectiveHostHeader = forwardedHost || hostHeader || nextUrl.host;
        
        const realHost = effectiveHostHeader.split(':')[0];
        const isLocal = realHost === 'localhost' || realHost === '127.0.0.1';
        
        const port = effectiveHostHeader.includes(':') ? effectiveHostHeader.split(':')[1] : (isLocal ? (nextUrl.port || '3000') : '');

        let correctAppHost = realHost;
        if (isLocal) {
          correctAppHost = `app.localhost`;
        } else if (realHost === 'directly.social' || realHost === 'www.directly.social') {
          correctAppHost = "app.directly.social";
        } else if (!realHost.startsWith('app.')) {
          correctAppHost = `app.${realHost}`;
        }

        // If they are on the wrong domain for login, redirect them to the app subdomain login page
        if (realHost !== correctAppHost && realHost !== correctAppHost.split(':')[0]) {
          targetUrl.hostname = correctAppHost.split(':')[0];
          targetUrl.port = port;
          targetUrl.pathname = '/login';
          return Response.redirect(targetUrl);
        }

        if (isLoggedIn) {
          targetUrl.hostname = correctAppHost.split(':')[0];
          targetUrl.port = port;
          targetUrl.pathname = '/';
          return Response.redirect(targetUrl);
        }
        
        return true;
      }

      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnAdmin) {
        if (!isLoggedIn) return Response.redirect(new URL("/login", nextUrl));
        const role = auth?.user?.role;
        if (role !== "ADMIN") {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      const isOnSettings = nextUrl.pathname.startsWith("/settings");
      const isOnSchedule = nextUrl.pathname.startsWith("/schedule");
      const isOnActivity = nextUrl.pathname.startsWith("/activity");
      const isOnMedia = nextUrl.pathname.startsWith("/media");

      if (isOnSettings || isOnSchedule || isOnActivity || isOnMedia) {
        return isLoggedIn ? true : Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
