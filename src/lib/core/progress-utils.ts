import { logger } from "./logger";

export async function createProgressReporter(historyId?: string, platform?: string, accountId?: string) {
  let lastReported = -1;
  return async (percent: number) => {
    const currentPercent = Math.floor(percent);
    if (currentPercent > lastReported && historyId && platform && accountId) {
      lastReported = currentPercent;
      logger.info(` [HEARTBEAT] ${platform} (${accountId}): ${currentPercent}%`);
      const { updatePlatformProgress } = await import("./heartbeat-server");
      await updatePlatformProgress(historyId, platform, accountId, currentPercent);
    }
  };
}
