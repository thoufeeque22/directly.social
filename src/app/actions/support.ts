"use server";

import { protectedAction } from "@/lib/core/action-utils";
import { checkRateLimit } from "@/lib/core/ratelimit";
import { sensitiveRateLimit } from "@/lib/core/ratelimit-config";
import { SupportRequestSchema, SupportRequestInput } from "@/lib/schemas/support";
import { createSupportRequest } from "@/lib/services/support";

export interface ActionState {
  success: boolean;
  id?: string;
  error?: string;
}

export async function submitSupportRequestAction(data: SupportRequestInput): Promise<ActionState> {
  try {
    return await protectedAction(async (userId) => {
      const result = SupportRequestSchema.safeParse(data);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        const firstError = Object.values(fieldErrors).flat()[0] || "Invalid input data";
        return { success: false, error: firstError };
      }

      await checkRateLimit(
        sensitiveRateLimit,
        userId,
        "Too many support requests. Please try again later."
      );

      const request = await createSupportRequest(userId, result.data);

      return {
        success: true,
        id: request.id,
      };
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}

