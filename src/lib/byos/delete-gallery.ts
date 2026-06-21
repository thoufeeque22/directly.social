import { prisma } from '@/lib/core/prisma';
import { getByosConfig } from '@/lib/byos/service';
import { createS3Client } from '@/lib/upload/s3/client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export async function deleteByosAsset(userId: string, key: string) {
  const config = await getByosConfig(userId);
  if (!config) throw new Error('BYOS not configured');

  const client = createS3Client({
    endpoint: config.endpoint || undefined,
    region: config.region ?? '',
    accessKeyId: config.accessKeyId ?? '',
    secretAccessKey: config.secretAccessKey ?? '',
  });

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: config.bucketName,
        Key: key,
      })
    );
  } catch (err: unknown) {
    const errName = err instanceof Error ? err.name : '';
    const errCode = err && typeof err === 'object' && 'code' in err ? String((err as { code: unknown }).code) : '';
    if (errName === 'AccessDenied' || errCode === 'AccessDenied') {
      throw new Error('AccessDenied');
    }
    throw err;
  }

  await prisma.galleryAsset.deleteMany({
    where: {
      userId,
      metadata: {
        path: ['key'],
        equals: key,
      },
    },
  });

  return { success: true };
}
