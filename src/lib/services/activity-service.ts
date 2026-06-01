import { prisma } from "../core/prisma";

export interface CreateActivityParams {
  userId: string;
  title: string;
  description?: string | null;
  videoFormat: string;
  platforms: {
    platform: string;
    accountId: string;
    customContent?: any;
  }[];
}

/**
 * (CA-001): Service layer for Activity management.
 * Encapsulates persistence logic and decouples API routes from Prisma.
 */
export class ActivityService {
  /**
   * Initializes a new post activity with its associated platform schedules.
   */
  async initializeActivity(params: CreateActivityParams) {
    const { userId, title, description, videoFormat, platforms } = params;

    return prisma.postActivity.create({
      data: {
        userId,
        title,
        description: description || null,
        videoFormat,
        isPublished: false,
        scheduledAt: new Date(),
        platforms: {
          create: platforms.map((p) => ({
            platform: p.platform,
            accountId: p.accountId,
            status: 'pending',
            metadata: p.customContent ? { customContent: p.customContent } : undefined,
          })),
        },
      },
    });
  }
}

export const activityService = new ActivityService();
