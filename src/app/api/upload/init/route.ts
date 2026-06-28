import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { z } from "zod";
import { logger } from "@/lib/core/logger";
import { UploadInitSchema } from "@/lib/schemas/upload";
import { CreateActivityParams, activityService } from "@/lib/services/activity-service";
import { FreemiumGuard } from "@/lib/billing/freemium-guard";

/**
 * Upload Initialization API
 * (CA-001): Refactored to use activityService, removing direct Prisma dependency.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  try {
    const body = await req.json();
    const validated = UploadInitSchema.parse(body);
    const { title, description, videoFormat, platforms } = validated;

    // Check Freemium Guard quota
    const quotaCheck = await FreemiumGuard.checkUploadQuota(userId);
    if (!quotaCheck.allowed) {
      return NextResponse.json({ error: quotaCheck.reason }, { status: 403 });
    }

    logger.info(`Initializing upload for user ${userId}`, { platforms: platforms.length });

    const activity = await activityService.initializeActivity({
      userId,
      title,
      description,
      videoFormat,
      platforms: platforms as CreateActivityParams['platforms'],
    });

    return NextResponse.json({ success: true, data: { activityId: activity.id } });
  } catch (error: unknown) {
    logger.error("Upload Init Error", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
