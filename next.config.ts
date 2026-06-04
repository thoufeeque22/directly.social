import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // Allow Tunnel requests to hit the dev server without being blocked
  allowedDevOrigins: [
    "khalilah-spritelike-flossily.ngrok-free.dev",
    "*.trycloudflare.com",
    "directly-social.duckdns.org",
    "roohis-mac.tail8a2e7d.ts.net"
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "50gb",
    },
    proxyClientMaxBodySize: "50gb",
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: "/history",
        destination: "/activity",
        permanent: true,
      },
    ];
  },
};

// Check if we should skip Sentry during build to save memory (useful for 1GB RAM VPS)
const shouldSkipSentry = process.env.SKIP_SENTRY_BUILD === "true";

// Only wrap with Sentry if we have the necessary environment variables.
// This prevents noisy warnings during build when tokens are missing.
const useSentry = !shouldSkipSentry && !!process.env.SENTRY_AUTH_TOKEN;

export default useSentry 
  ? withSentryConfig(nextConfig, {
      // For all available options, see:
      // https://www.npmjs.com/package/@sentry/webpack-plugin#options

      org: "directly-pt",
      project: "directly",

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: false, // Set to false to save memory on 1GB VPS, true on Mac

      // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      tunnelRoute: "/monitoring",

      webpack: {
        // Enables automatic instrumentation of Vercel Cron Monitors.
        automaticVercelMonitors: true,

        // Tree-shaking options for reducing bundle size
        treeshake: {
          // Automatically tree-shake Sentry logger statements to reduce bundle size
          removeDebugLogging: true,
        },
      },
    })
  : nextConfig;
