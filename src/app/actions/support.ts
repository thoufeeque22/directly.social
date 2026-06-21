"use server";

import { protectedAction } from "@/lib/core/action-utils";
import { prisma } from "@/lib/core/prisma";
import { checkRateLimit } from "@/lib/core/ratelimit";
import { sensitiveRateLimit } from "@/lib/core/ratelimit-config";
import { SupportRequestSchema } from "@/lib/schemas/support";

interface SupportRequestData {
  topic: string;
  message: string;
}

export async function submitSupportRequestAction(data: SupportRequestData) {
  return protectedAction(async (userId) => {
    const result = SupportRequestSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0] || "Invalid input data";
      throw new Error(firstError);
    }

    await checkRateLimit(
      sensitiveRateLimit,
      userId,
      "Too many support requests. Please try again later."
    );

    const request = await prisma.supportRequest.create({
      data: {
        userId,
        topic: result.data.topic,
        message: result.data.message,
      },
    });

    return {
      success: true,
      id: request.id,
    };
  });
}
