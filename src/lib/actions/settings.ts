'use server';

import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import { ByosConfigSchema } from '@/lib/schemas/settings';
import { getByosConfig, saveByosConfig } from '@/lib/byos/service';
import { z } from 'zod';

/**
 * Saves BYOS (Bring Your Own Storage) configuration.
 */
export async function saveByosConfigAction(data: unknown) {
  return protectedAction(async (userId) => {
    const validated = ByosConfigSchema.parse(data);
    const config = await saveByosConfig(userId, validated);
    await revalidateDashboard();
    return { success: true, config };
  });
}

/**
 * Retrieves BYOS configuration.
 */
export async function getByosConfigAction() {
  return protectedAction(async (userId) => {
    const config = await getByosConfig(userId);
    return { config };
  });
}

/**
 * Disconnects a platform account.
 */
export async function disconnectPlatformAction(provider: string) {
  return protectedAction(async (userId) => {
    if (!provider) {
      throw new Error("Provider required");
    }

    await prisma.account.deleteMany({
      where: {
        userId,
        provider,
      },
    });

    await revalidateDashboard();
    return { success: true };
  });
}
