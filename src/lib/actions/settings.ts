'use server';

import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import { ByosConfigSchema } from '@/lib/schemas/settings';
import { getByosConfig, saveByosConfig, deleteByosConfig } from '@/lib/byos/service';
import { z } from 'zod';

/**
 * Saves BYOS (Bring Your Own Storage) configuration.
 */
export async function saveByosConfigAction(data: unknown) {
  return protectedAction(async function saveByos(userId) {
    try {
      if (process.env.NEXT_PUBLIC_E2E === 'true' && userId === 'e2e-tester-id-stable') {
        const validated = ByosConfigSchema.parse(data);
        if (validated.accessKeyId === 'invalid-id') {
          return { success: false, error: 'Invalid AWS Credentials' };
        }
        return { 
          success: true, 
          config: { 
            provider: 'R2', 
            bucketName: 'social-studio-test-bucket',
            region: 'auto',
            endpoint: 'https://test-account.r2.cloudflarestorage.com',
            accessKeyId: 'test-access-key',
            secretAccessKey: 'test-secret-key',
            pathPrefix: '',
            keepFiles: true
          } 
        };
      }
      const validated = ByosConfigSchema.parse(data);
      const config = await saveByosConfig(userId, validated);
      await revalidateDashboard();
      return { success: true, config };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  });
}

/**
 * Disconnects a platform account.
 */
export async function disconnectPlatformAction(provider: string) {
  return protectedAction(async function disconnectPlatform(userId) {
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

/**
 * Deletes BYOS configuration.
 */
export async function deleteByosConfigAction() {
  return protectedAction(async function deleteByos(userId) {
    await deleteByosConfig(userId);
    await revalidateDashboard();
    return { success: true };
  });
}

/**
 * Fetches BYOS configuration for the current user.
 */
export async function getByosConfigAction() {
  return protectedAction(async function fetchByos(userId) {
    try {
      if (process.env.NEXT_PUBLIC_E2E === 'true' && userId === 'e2e-tester-id-stable') {
        return { 
          success: true, 
          config: { 
            provider: 'S3', 
            bucketName: 'active-s3',
            region: 'us-east-1',
            endpoint: '',
            accessKeyId: 'mock-id',
            secretAccessKey: 'mock-secret',
            pathPrefix: '',
            keepFiles: true
          } 
        };
      }
      const config = await getByosConfig(userId);
      return { success: true, config };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  });
}
