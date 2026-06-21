import { prisma } from "@/lib/core/prisma";
import { SupportRequestInput } from "@/lib/schemas/support";

export async function createSupportRequest(userId: string, data: SupportRequestInput) {
  return prisma.supportRequest.create({
    data: {
      userId,
      topic: data.topic,
      message: data.message,
    },
  });
}
