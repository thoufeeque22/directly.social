import { S3Client, CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/core/prisma';
import { randomUUID } from 'crypto';

interface S3Part {
  PartNumber: number;
  ETag: string;
}

export const completeMultipartUpload = async (client: S3Client, bucketName: string, key: string, uploadId: string, parts: S3Part[]) => {
  const command = new CompleteMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  });
  return await client.send(command);
};

interface ByosAssetData {
  fileName: string;
  fileSize: number | bigint;
  mimeType?: string;
}

export const createByosAsset = async (userId: string, data: ByosAssetData, provider: string, bucket: string, key: string) => {
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

interface ByosPostData {
  scheduledAt?: string;
  platforms?: { platform: string; accountId: string; transcodeStatus?: string }[];
  activityId?: string;
  title?: string;
  description?: string;
  videoFormat?: string;
  fileName?: string;
}

export const upsertPostActivityForByos = async (userId: string, fileId: string, data: ByosPostData) => {
  const finalScheduledAt = data.scheduledAt && !isNaN(new Date(data.scheduledAt).getTime()) ? new Date(data.scheduledAt) : new Date();
  const initialPlatformData = data.platforms?.map((p) => ({ platform: p.platform, accountId: p.accountId, status: 'pending' as const, transcodeStatus: 'skipped' as const })) || [];

  if (data.activityId) {
    return await prisma.postActivity.update({
      where: { id: data.activityId, userId },
      data: {
        stagedFileId: fileId, title: data.title, description: data.description, scheduledAt: finalScheduledAt,
        platforms: {
          upsert: initialPlatformData.map((p) => ({
            where: { postActivityId_platform_accountId: { postActivityId: data.activityId!, platform: p.platform, accountId: p.accountId } },
            update: { accountId: p.accountId, transcodeStatus: 'skipped' },
            create: { platform: p.platform, accountId: p.accountId, status: 'pending', transcodeStatus: 'skipped' },
          })),
        },
      },
    });
  }

  return await prisma.postActivity.create({
    data: {
      userId, title: data.title || data.fileName || 'Untitled Post', description: data.description || null,
      videoFormat: data.videoFormat || 'short', stagedFileId: fileId, isPublished: false, scheduledAt: finalScheduledAt,
      platforms: { create: initialPlatformData },
    },
  });
};
