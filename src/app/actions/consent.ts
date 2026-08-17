'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/core/prisma";

export async function updateAiConsent() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { aiProcessingConsent: true },
  });

  return { success: true };
}
