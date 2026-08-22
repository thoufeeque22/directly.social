'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/core/prisma";

export async function updateAiConsent() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        aiProcessingConsent: true,
        genAITermsAcceptedAt: new Date(),
        genAITermsVersion: '1.0'
      },
    });
    return { success: true };
  } catch (e: any) {
    console.error("Error updating AI consent:", e.message);
    return { success: false, error: "An error occurred while updating consent." };
  }
}
