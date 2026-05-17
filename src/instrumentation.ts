import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
    
    // Start the background publishing worker (Skip on Vercel)
    if (!process.env.VERCEL) {
      const { startPublishingWorker } = await import("./lib/worker/worker");
      startPublishingWorker();
    }
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
