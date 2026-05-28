import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/core/prisma";
import { z } from "zod";
import { uploadRateLimit, checkRateLimit } from "@/lib/core/ratelimit";
import { logger } from "@/lib/core/logger";
import { UploadInitSchema } from "@/lib/schemas/upload";

/**
 * INIT HANDLER
 * Pre-initializes a post activity record so it appears in the Activity Hub
 * even before the physical upload/assembly is finished.
 */
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // 1. Rate Limiting
    await checkRateLimit(uploadRateLimit, userId, "Upload initialization limit reached. Please wait a minute.");

    // 2. Runtime Validation
    const body = await req.json();
    const validated = UploadInitSchema.parse(body);
    const { title, description, videoFormat, platforms } = validated;

    logger.info(`Initializing upload for user ${userId}`, { platforms: platforms.length });

    const activity = await prisma.postActivity.create({
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
            metadata: p.customContent ? { customContent: p.customContent } : undefined
          }))
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: { activityId: activity.id } 
    });
  } catch (error: unknown) {
    logger.error("Upload Init Error", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: message.includes("limit reached") ? 429 : 500 });
  }
}
