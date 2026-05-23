import { S3Client, CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/core/prisma';
import { randomUUID } from 'crypto';

export const completeMultipartUpload = async (client: S3Client, bucketName: string, key: string, uploadId: string, parts: any[]) => {
  const command = new CompleteMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  });
  return await client.send(command);
};

export const createByosAsset = async (userId: string, data: any, provider: string, bucket: string, key: string) => {
  const fileId = `byos_${randomUUID()}`;
  const expiresAt = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);

  return await prisma.galleryAsset.create({
    data: {
      userId, fileId, fileName: data.fileName, fileSize: BigInt(data.fileSize),
      mimeType: data.mimeType || 'video/mp4', expiresAt, processingStatus: 'ready',
      metadata: { provider, bucket, key, byos: true },
    },
  });
};

export const upsertPostHistoryForByos = async (userId: string, fileId: string, data: any) => {
  const finalScheduledAt = data.scheduledAt && !isNaN(new Date(data.scheduledAt).getTime()) ? new Date(data.scheduledAt) : new Date();
  const initialPlatformData = data.platforms?.map((p: any) => ({ platform: p.platform, accountId: p.accountId, status: 'pending', transcodeStatus: 'skipped' })) || [];

  if (data.historyId) {
    return await prisma.postHistory.update({
      where: { id: data.historyId, userId },
      data: {
        stagedFileId: fileId, title: data.title, description: data.description, scheduledAt: finalScheduledAt,
        platforms: {
          upsert: initialPlatformData.map((p: any) => ({
            where: { postHistoryId_platform_accountId: { postHistoryId: data.historyId, platform: p.platform, accountId: p.accountId } },
            update: { accountId: p.accountId, transcodeStatus: p.transcodeStatus },
            create: p,
          })),
        },
      },
    });
  }

  return await prisma.postHistory.create({
    data: {
      userId, title: data.title || data.fileName || 'Untitled Post', description: data.description || null,
      videoFormat: data.videoFormat || 'short', stagedFileId: fileId, isPublished: false, scheduledAt: finalScheduledAt,
      platforms: { create: initialPlatformData },
    },
  });
};
