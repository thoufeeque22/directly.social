import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/core/prisma";
import { buildInitialPlatformData, getFinalScheduledAt } from "./activity-helpers";

export interface PlatformInput {
  platform: string;
  accountId: string;
  metadata?: Prisma.JsonValue;
}

export interface ActivityRegistrationParams {
  userId: string;
  fileId: string;
  fileName: string;
  finalPath: string;
  activityId?: string | null;
  title?: string | null;
  description?: string | null;
  videoFormat?: string | null;
  platforms?: PlatformInput[] | null;
  scheduledAt?: string | null;
  transcodeResults?: Record<string, { needsTranscode: boolean }>;
}

export async function upsertUploadActivity(params: ActivityRegistrationParams) {
  const {
    userId, fileId, fileName, activityId, title, description,
    videoFormat, platforms, scheduledAt, transcodeResults
  } = params;

  const initialPlatformData = buildInitialPlatformData(platforms, transcodeResults || {});
  const finalScheduledAt = getFinalScheduledAt(scheduledAt);

  if (activityId) {
    return prisma.postActivity.update({
      where: { id: activityId, userId },
      data: {
        stagedFileId: fileId, title: title || undefined, description: description || undefined,
        isPublished: false, scheduledAt: finalScheduledAt,
        platforms: {
          upsert: initialPlatformData.map((p) => ({
            where: { postActivityId_platform_accountId: { postActivityId: activityId, platform: p.platform, accountId: p.accountId } },
            update: { 
              accountId: p.accountId, 
              transcodeStatus: p.transcodeStatus,
              metadata: p.metadata ?? Prisma.JsonNull
            },
            create: p,
          })),
        },
      },
    });
  }

  return prisma.postActivity.create({
    data: {
      userId, title: title || fileName || "Untitled Post", description: description || null,
      videoFormat: videoFormat || "short", stagedFileId: fileId, isPublished: false,
      scheduledAt: finalScheduledAt, platforms: { create: initialPlatformData },
    },
  });
}
