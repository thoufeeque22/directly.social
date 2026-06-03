import { prisma } from "../core/prisma";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";

export interface CreateActivityParams {
  userId: string;
  title?: string | null;
  description?: string | null;
  videoFormat: string;
  platforms: {
    platform: string;
    accountId: string;
    customContent?: Prisma.JsonValue;
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
    const defaultTitle = format(new Date(), "d MMMM yyyy");

    return prisma.postActivity.create({
      data: {
        userId,
        title: title || defaultTitle,
        description: description || null,
        videoFormat,
        isPublished: false,
        scheduledAt: new Date(),
        platforms: {
          create: platforms.map((p) => ({
            platform: p.platform,
            accountId: p.accountId,
            status: 'pending',
            metadata: p.customContent ?? Prisma.JsonNull,
          })),
        },
      },
    });
  }
}

export const activityService = new ActivityService();
