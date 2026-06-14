import { PublishingRepository } from "../platforms/types";
import { fetchExistingResult, upsertPlatformResult, updatePlatformProgress } from "@/lib/worker/server-distributor.db";

/**
 * (CA-001): Implementation of PublishingRepository using Prisma.
 */
export class PrismaPublishingRepository implements PublishingRepository {
  async fetchState(activityId: string, platform: string, accountId: string): Promise<any> {
    return fetchExistingResult(activityId, platform, accountId);
  }

  async upsertState(activityId: string, platform: string, accountId: string, data: any): Promise<void> {
    await upsertPlatformResult(activityId, platform, accountId, data);
  }

  async updateProgress(activityId: string, platform: string, accountId: string, percent: number): Promise<void> {
    const record = await this.fetchState(activityId, platform, accountId);
    if (record) {
      await updatePlatformProgress(record.id, percent);
    }
  }
}
