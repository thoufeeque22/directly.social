"use server";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/core/prisma";

const getCachedLicensesLeft = unstable_cache(
  async () => {
    const count = await prisma.billingProfile.count({
      where: {
        subscriptionTier: "LIFETIME_DEAL",
      },
    });

    const maxCap = process.env.LIFETIME_CAP ? parseInt(process.env.LIFETIME_CAP, 10) : 15;
    return Math.max(0, maxCap - count);
  },
  ["lifetime-licenses-left"],
  {
    revalidate: 60, // 60 seconds TTL
  }
);

export async function getLifetimeLicensesLeft() {
  return await getCachedLicensesLeft();
}
