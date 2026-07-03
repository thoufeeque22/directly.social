/* eslint-disable max-lines */
import type { NextAuthConfig } from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import TikTok from "next-auth/providers/tiktok";
import type { User } from "next-auth";

export default {
  useSecureCookies: process.env.NEXT_PUBLIC_E2E !== 'true',
  // ... rest of the config ...
  providers: [
    Google({
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
      return url.startsWith("/") ? new URL(url, baseUrl).toString() : url;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.aiCredits = (user as User).aiCredits;
      }
      
      // Handle session updates from the client
      if (trigger === "update" && session?.aiCredits !== undefined) {
        token.aiCredits = session.aiCredits;
      }
      
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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname === "/login";

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
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
