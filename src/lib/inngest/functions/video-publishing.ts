import { inngest } from "../client";
import { getPlatformActivity } from "@/lib/platforms/factory";
import { PrismaPublishingRepository } from "@/lib/infrastructure/publishing-repository";
import { FileSystemStorageProvider } from "@/lib/infrastructure/storage-provider";
import { 
  VerificationParams, 
  InitiationParams, 
  PushParams, 
  PollingParams, 
  FinalizationParams 
} from "@/lib/platforms/types";
import { VideoPublishEvent } from "../events";

// Dependencies
const repository = new PrismaPublishingRepository();
const storage = new FileSystemStorageProvider();

/**
 * (CA-001): Durable workflow for video publishing.
 * (CA-002): Uses StorageProvider for file resolution.
 * (API-001): Decomposed params for activity calls.
 */
export const videoPublishingWorkflow = inngest.createFunction(
  { 
    id: "video-publishing-workflow", 
    name: "Video Publishing Workflow",
    triggers: [{ event: "video.publish" }]
  },
  // @ts-ignore - Inngest v4 type mismatch in some environments
  async ({ event, step }: { event: VideoPublishEvent; step: any }) => {
    const { activityId, platform, accountId, userId, stagedFileId, title, description, videoFormat } = event.data;
    const activity = getPlatformActivity(platform);

    const activeFilePath = await step.run("resolve-video-path", async () => {
      return storage.resolvePath(stagedFileId, platform, activityId, accountId);
    });

    const existing = await step.run("fetch-state", async () => {
      return repository.fetchState(activityId, platform, accountId);
    });

    const baseParams = { userId, activityId, platform, accountId };

    await step.run("pre-verify", async () => {
      const params: VerificationParams = { ...baseParams };
      await activity.preVerify(params);
      await repository.upsertState(activityId, platform, accountId, { currentStep: "pre_verify" });
    });

    const { creationId } = await step.run("init", async () => {
      const params: InitiationParams = { 
        ...baseParams, 
        title, 
        description, 
        videoFormat, 
        filePath: activeFilePath 
      };
      const res = await activity.init(params);
      await repository.upsertState(activityId, platform, accountId, { 
        currentStep: "init", 
        creationId: res.creationId 
      });
      return res;
    });

    const { platformPostId } = await step.run("push", async () => {
      const params: PushParams = {
        ...baseParams,
        title,
        description,
        videoFormat,
        filePath: activeFilePath,
        creationId,
        onProgress: async (pct) => {
          await repository.updateProgress(activityId, platform, accountId, pct);
        }
      };
      const res = await activity.push(params);
      await repository.upsertState(activityId, platform, accountId, { 
        currentStep: "push", 
        resumableUrl: res.resumableUrl,
        platformPostId: res.platformPostId
      });
      return res;
    });

    await step.run("poll", async () => {
      const params: PollingParams = { ...baseParams, creationId };
      await activity.poll(params);
      await repository.upsertState(activityId, platform, accountId, { currentStep: "poll" });
    });

    const result = await step.run("finalize", async () => {
      const params: FinalizationParams = { ...baseParams, creationId };
      const res = await activity.finalize(params);
      await repository.upsertState(activityId, platform, accountId, { 
        currentStep: "finalize",
        status: "success",
        platformPostId: res.id || platformPostId,
        permalink: res.permalink
      });
      return res;
    });

    return result;
  }
);
