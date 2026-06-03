import { PlatformInput } from "./activity-registration";

export function buildInitialPlatformData(
  platforms: PlatformInput[] | null | undefined, 
  transcodeResults: Record<string, { needsTranscode: boolean }>
) {
  if (!platforms) return [];
  return platforms.map((p) => ({
    platform: p.platform,
    accountId: p.accountId,
    status: "pending",
    transcodeStatus: transcodeResults[p.platform]?.needsTranscode ? "pending" : "skipped",
    metadata: p.metadata || undefined,
  }));
}

export function getFinalScheduledAt(scheduledAt?: string | null) {
  return scheduledAt && !isNaN(new Date(scheduledAt).getTime()) ? new Date(scheduledAt) : new Date();
}
