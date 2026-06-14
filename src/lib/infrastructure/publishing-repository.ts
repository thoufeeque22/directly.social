import { PublishingRepository } from "../platforms/types";
import { fetchExistingResult, upsertPlatformResult, updatePlatformProgress } from "@/lib/worker/server-distributor.db";

/**
 * (CA-001): Implementation of PublishingRepository using Prisma.
 */
export class PrismaPublishingRepository implements PublishingRepository {
  async fetchState(activityId: string, platform: string, accountId: string): Promise<Record<string, unknown> | null> {
    const res = await fetchExistingResult(activityId, platform, accountId);
    return res ? (res as unknown as Record<string, unknown>) : null;
  }

  async upsertState(activityId: string, platform: string, accountId: string, data: Record<string, unknown>): Promise<void> {
    await upsertPlatformResult(activityId, platform, accountId, data as any);
  }

  async updateProgress(activityId: string, platform: string, accountId: string, percent: number): Promise<void> {
    const record = await this.fetchState(activityId, platform, accountId);
    if (record && record.id) {
      await updatePlatformProgress(record.id as string, percent);
    }
  }
}
