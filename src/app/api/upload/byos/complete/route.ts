import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { decryptByos } from '@/lib/core/byos-encrypt';
import { S3Client, CompleteMultipartUploadCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const completeSchema = z.object({
  uploadId: z.string().min(1, 'uploadId is required'),
  key: z.string().min(1, 'key is required'),
  fileName: z.string().min(1, 'fileName is required'),
  fileSize: z.number().min(1, 'fileSize is required'),
  mimeType: z.string().optional().default('video/mp4'),
  parts: z
    .array(
      z.object({
        PartNumber: z.number().int().min(1),
        ETag: z.string().min(1, 'ETag is required'),
      })
    )
    .min(1, 'At least one part is required'),
  title: z.string().optional(),
  description: z.string().optional(),
  videoFormat: z.string().optional(),
  historyId: z.string().optional(),
  platforms: z
    .array(
      z.object({
        platform: z.string(),
        accountId: z.string(),
      })
    )
    .optional(),
  scheduledAt: z.string().optional(),
});

function createS3Client(config: {
  provider: 'S3' | 'R2';
  bucketName: string;
  endpoint?: string | null;
  region?: string | null;
  accessKeyId: string;
  secretAccessKey: string;
}) {
  const s3Config: S3ClientConfig = {
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    region: config.region || 'us-east-1',
  };

  if (config.provider === 'R2') {
    if (!config.endpoint) {
      throw new Error('Endpoint is required for Cloudflare R2');
    }
    s3Config.endpoint = config.endpoint;
    s3Config.region = config.region || 'auto';
  } else if (config.endpoint) {
    s3Config.endpoint = config.endpoint;
  }

  return new S3Client(s3Config);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    const result = completeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const {
      uploadId,
      key,
      fileName,
      fileSize,
      mimeType,
      parts,
      title,
      description,
      videoFormat,
      historyId,
      platforms,
      scheduledAt,
    } = result.data;

    // Retrieve BYOS configuration
    const byosConfig = await prisma.byosConfig.findUnique({
      where: { userId },
    });

    if (!byosConfig) {
      return NextResponse.json({ error: 'BYOS is not configured for this user' }, { status: 400 });
    }

    const decryptedAccessKeyId = decryptByos(byosConfig.accessKeyId);
    const decryptedSecretAccessKey = decryptByos(byosConfig.secretAccessKey);

    const client = createS3Client({
      provider: byosConfig.provider,
      bucketName: byosConfig.bucketName,
      endpoint: byosConfig.endpoint,
      region: byosConfig.region,
      accessKeyId: decryptedAccessKeyId,
      secretAccessKey: decryptedSecretAccessKey,
    });

    // Complete Multipart Upload in S3
    try {
      const command = new CompleteMultipartUploadCommand({
        Bucket: byosConfig.bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts,
        },
      });

      await client.send(command);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Failed to complete S3 multipart upload:', msg);
      return NextResponse.json({ error: `Failed to complete S3 multipart upload: ${msg}` }, { status: 400 });
    }

    // Save as GalleryAsset in database
    const fileId = `byos_${randomUUID()}`;
    const expiresAt = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000); // 100 years

    await prisma.galleryAsset.create({
      data: {
        userId,
        fileId,
        fileName,
        fileSize: BigInt(fileSize),
        mimeType,
        expiresAt,
        processingStatus: 'ready',
        metadata: {
          provider: byosConfig.provider,
          bucket: byosConfig.bucketName,
          key,
          byos: true,
        },
      },
    });

    // UPSERT POST HISTORY RECORD
    let history;
    const initialPlatformData = platforms
      ? platforms.map((p) => ({
          platform: p.platform,
          accountId: p.accountId,
          status: 'pending',
          transcodeStatus: 'skipped',
        }))
      : [];

    const finalScheduledAt = scheduledAt && !isNaN(new Date(scheduledAt).getTime()) ? new Date(scheduledAt) : new Date();

    if (historyId) {
      history = await prisma.postHistory.update({
        where: { id: historyId, userId },
        data: {
          stagedFileId: fileId,
          title: title || undefined,
          description: description || undefined,
          isPublished: false,
          scheduledAt: finalScheduledAt,
          platforms: {
            upsert: initialPlatformData.map((p) => ({
              where: {
                postHistoryId_platform_accountId: {
                  postHistoryId: historyId,
                  platform: p.platform,
                  accountId: p.accountId,
                },
              },
              update: {
                accountId: p.accountId,
                transcodeStatus: p.transcodeStatus,
              },
              create: p,
            })),
          },
        },
      });
    } else {
      history = await prisma.postHistory.create({
        data: {
          userId,
          title: title || fileName || 'Untitled Post',
          description: description || null,
          videoFormat: videoFormat || 'short',
          stagedFileId: fileId,
          isPublished: false,
          scheduledAt: finalScheduledAt,
          platforms: {
            create: initialPlatformData,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        fileId,
        fileName,
        historyId: history.id,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Failed to complete upload:', msg);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
