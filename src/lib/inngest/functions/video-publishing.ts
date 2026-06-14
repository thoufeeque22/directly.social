import { inngest } from "../client";
import { getPlatformActivity } from "@/lib/platforms/factory";
import { 
  VerificationParams, 
  InitiationParams, 
  PushParams 
} from "@/lib/platforms/types";
import { VideoPublishEvent } from "../events";
import { getRepository, getStorage } from "@/lib/infrastructure";
import { GetStepTools } from "inngest";

/**
 * (CA-001): Durable workflow logic for video publishing.
 * (CA-002): Uses StorageProvider for file resolution and metadata.
 * (DIP): Resolves repository and storage via Service Locator for testability.
 */
export const videoPublishingHandler = async ({ 
  event, 
  step 
}: { 
  event: VideoPublishEvent; 
  step: GetStepTools<typeof inngest> 
}) => {
  const { activityId, platform, accountId, userId, stagedFileId, title, description, videoFormat } = event.data;
  const activity = getPlatformActivity(platform);
  const repository = getRepository();
  const storage = getStorage();

  const activeFilePath = await step.run("resolve-video-path", async () => {
    return storage.resolvePath(stagedFileId, platform, activityId, accountId);
  });

  await step.run("fetch-state", async () => repository.fetchState(activityId, platform, accountId));

  const baseParams = { userId, activityId, platform, accountId };

  await step.run("pre-verify", async () => {
    const params: VerificationParams = { ...baseParams };
    await activity.preVerify(params);
    await repository.upsertState(activityId, platform, accountId, { currentStep: "pre_verify" });
  });

  const { creationId, resumableUrl: initialResumableUrl } = await step.run("init", async () => {
    const params: InitiationParams = { ...baseParams, title, description, videoFormat, filePath: activeFilePath, storage };
    const res = await activity.init(params);
    await repository.upsertState(activityId, platform, accountId, { 
      currentStep: "init", creationId: res.creationId, resumableUrl: res.resumableUrl 
    });
    return res;
  });

  const { platformPostId } = await step.run("push", async () => {
    let lastProgressUpdate = 0;
    const params: PushParams = {
      ...baseParams, title, description, videoFormat, filePath: activeFilePath, creationId,
      resumableUrl: initialResumableUrl, storage,
      onProgress: async (pct) => {
        // Performance (High): Throttle DB writes to once per 2 seconds
        const now = Date.now();
        if (now - lastProgressUpdate > 2000 || pct === 100) {
          await repository.updateProgress(activityId, platform, accountId, pct);
          lastProgressUpdate = now;
        }
      }
    };
    const res = await activity.push(params);
    await repository.upsertState(activityId, platform, accountId, { 
      currentStep: "push", resumableUrl: res.resumableUrl, platformPostId: res.platformPostId
    });
    return res;
  });

  await step.run("poll", async () => {
    await activity.poll({ ...baseParams, creationId });
    await repository.upsertState(activityId, platform, accountId, { currentStep: "poll" });
  });

  return await step.run("finalize", async () => {
    const res = await activity.finalize({ ...baseParams, creationId, title, description });
    await repository.upsertState(activityId, platform, accountId, { 
      currentStep: "finalize", status: "success", platformPostId: res.id || platformPostId, permalink: res.permalink
    });
    return res;
  });
};

/**
 * (CA-001): Durable workflow for video publishing.
 */
export const videoPublishingWorkflow = inngest.createFunction(
  { 
    id: "video-publishing-workflow", 
    name: "Video Publishing Workflow",
    triggers: [{ event: "video.publish" }]
  },
  videoPublishingHandler
);
