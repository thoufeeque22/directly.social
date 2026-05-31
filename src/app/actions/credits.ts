"use server";

import { protectedAction } from "@/lib/core/action-utils";
import { prisma } from "@/lib/core/prisma";

export async function getAiBalance() {
  return protectedAction(async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { aiCredits: true }
    });
    return user?.aiCredits ?? 0;
  });
}
