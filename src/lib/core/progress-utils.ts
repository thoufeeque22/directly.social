import { logger } from "./logger";

export async function createProgressReporter(activityId?: string, platform?: string, accountId?: string) {
  let lastReported = -1;
  return async (percent: number) => {
    const currentPercent = Math.floor(percent);
    if (currentPercent > lastReported && activityId && platform && accountId) {
      lastReported = currentPercent;
      logger.info(` [HEARTBEAT] ${platform} (${accountId}): ${currentPercent}%`);
      const { updatePlatformProgress } = await import("./heartbeat-server");
      await updatePlatformProgress(activityId, platform, accountId, currentPercent);
    }
  };
}
