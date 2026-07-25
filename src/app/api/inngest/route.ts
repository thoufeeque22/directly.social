import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { videoPublishingWorkflow } from "@/lib/inngest/functions/video-publishing";
import { linkedInTokenValidator, linkedInTokenRefresher } from "@/lib/inngest/functions/linkedin-jobs";

/**
 * (API-003): Inngest API route for serverless workflow execution.
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    videoPublishingWorkflow,
    linkedInTokenValidator,
    linkedInTokenRefresher,
  ],
});
