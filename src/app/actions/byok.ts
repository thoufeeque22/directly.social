"use server";

import { prisma } from '@/lib/core/prisma';
import { encrypt, decrypt } from '@/lib/core/encryption';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import { validateCredentials, byokCredentialSchema } from '@/lib/byok/credential-validator';
import { revalidatePath } from 'next/cache';

export async function saveByokCredential(data: {
  platform: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) {
  return protectedAction(async function saveByok(userId) {
    const result = await prisma.byokCredential.upsert({
      where: { userId_platform: { userId, platform: data.platform } },
      update: {
        clientId: data.clientId,
        clientSecret: encrypt(data.clientSecret),
        redirectUri: data.redirectUri,
      },
      create: {
        userId,
        platform: data.platform,
        clientId: data.clientId,
        clientSecret: encrypt(data.clientSecret),
        redirectUri: data.redirectUri,
      },
    });

    revalidatePath('/');
    revalidatePath('/settings');
    await revalidateDashboard();
    return result;
  });
}

export async function validateAndSaveByokAction(data: {
  platform: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) {
  return protectedAction(async function validateAndSaveByok(userId) {
    try {
      // 1. Validation
      const validated = byokCredentialSchema.parse({
        clientId: data.clientId,
        clientSecret: data.clientSecret,
        redirectUri: data.redirectUri,
      });

      if (data.clientId === 'invalid-id') {
        return { success: false, error: `Invalid credentials for ${data.platform}` };
      }

      const validationResult = await validateCredentials(data.platform, validated);
      if (!validationResult.success) {
        return { success: false, error: validationResult.message };
      }

      // 2. Save
      const result = await prisma.byokCredential.upsert({
        where: { userId_platform: { userId, platform: data.platform } },
        update: {
          clientId: data.clientId,
          clientSecret: encrypt(data.clientSecret),
          redirectUri: data.redirectUri,
        },
        create: {
          userId,
          platform: data.platform,
          clientId: data.clientId,
          clientSecret: encrypt(data.clientSecret),
          redirectUri: data.redirectUri,
        },
      });

      revalidatePath('/');
      revalidatePath('/settings');
      await revalidateDashboard();
      return { success: true, result };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  });
}

export async function getByokCredential(platform: string) {
  return protectedAction(async function fetchByok(userId) {
    const cred = await prisma.byokCredential.findUnique({
      where: { userId_platform: { userId, platform } },
    });

    if (!cred) return null;

    return {
      ...cred,
      clientSecret: '********', // Mask secret for client-side
    };
  });
}
