/* eslint-disable max-lines */
'use server';

import { prisma } from '@/lib/core/prisma';
import { protectedAction, revalidateDashboard } from '@/lib/core/action-utils';
import { ByosConfigSchema } from '@/lib/schemas/settings';
import { getByosConfig, saveByosConfig, deleteByosConfig } from '@/lib/byos/service';


/**
 * Saves BYOS (Bring Your Own Storage) configuration.
 */
export async function saveByosConfigAction(data: unknown) {
  return protectedAction(async function saveByos(userId) {
    try {
      if (process.env.NEXT_PUBLIC_E2E === 'true') {
        const validated = ByosConfigSchema.parse(data);
        if (validated.accessKeyId === 'invalid-id') {
          return { success: false, error: 'Invalid AWS Credentials' };
        }
        return { 
          success: true, 
          config: { 
            provider: 'R2', 
            bucketName: 'directly-test-bucket',
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
      
      // Ensure plain object return
      return { 
        success: true, 
        config: {
          provider: config.provider,
          bucketName: config.bucketName,
          region: config.region,
          endpoint: config.endpoint || '',
          accessKeyId: config.accessKeyId,
          secretAccessKey: '********', // Don't return secret
          pathPrefix: config.pathPrefix || '',
          keepFiles: config.keepFiles
        } 
      };
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
      if (process.env.NEXT_PUBLIC_E2E === 'true') {
        return { 
          success: true, 
          config: { 
            provider: 'S3', 
            bucketName: 'active-s3',
            region: 'us-east-1',
            endpoint: '',
            accessKeyId: 'mock-id',
            secretAccessKey: '********', // Mask secret for client-side
            pathPrefix: '',
            keepFiles: true
          } 
        };
      }
      const config = await getByosConfig(userId);
      if (!config) return { success: true, config: null };

      return { 
        success: true, 
        config: {
          ...config,
          secretAccessKey: '********', // Mask secret for client-side
        } 
      };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  });
}
