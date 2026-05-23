import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { decryptByos } from '@/lib/core/byos-encrypt';
import { uploadRateLimit, checkRateLimit } from '@/lib/core/ratelimit';
import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const MAX_SIZE = 500 * 1024 * 1024; // 500MB

const presignSchema = z.object({
  action: z.enum(['initialize', 'presignPart']),
  fileName: z.string().min(1, 'fileName is required'),
  fileSize: z.number().max(MAX_SIZE, 'File size exceeds maximum limit of 500MB').optional(),
  uploadId: z.string().optional(),
  key: z.string().optional(),
  partNumber: z.number().int().min(1).optional(),
});

function sanitizePath(fileName: string): string {
  const ext = fileName.includes('.') ? fileName.split('.').pop() : '';
  const base = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
  const safeBase = base.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeExt = ext ? ext.replace(/[^a-zA-Z0-9]/g, '') : '';
  return safeExt ? `${safeBase}.${safeExt}` : safeBase;
}

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

    // Rate limiting
    try {
      await checkRateLimit(uploadRateLimit, userId, 'Upload limit reached. Please wait a minute.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: msg }, { status: 429 });
    }

    const body = await req.json();
    const result = presignSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { action, fileName, fileSize, uploadId, key, partNumber } = result.data;

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

    if (action === 'initialize') {
      if (!fileSize) {
        return NextResponse.json({ error: 'fileSize is required for initialization' }, { status: 400 });
      }

      const safeName = sanitizePath(fileName);
      const s3Key = byosConfig.pathPrefix
        ? `${byosConfig.pathPrefix.replace(/\/$/, '')}/${Date.now()}-${randomUUID()}-${safeName}`
        : `uploads/${Date.now()}-${randomUUID()}-${safeName}`;

      const command = new CreateMultipartUploadCommand({
        Bucket: byosConfig.bucketName,
        Key: s3Key,
      });

      const response = await client.send(command);

      return NextResponse.json({
        success: true,
        uploadId: response.UploadId,
        key: s3Key,
      });
    } else {
      // presignPart
      if (!uploadId || !key || !partNumber) {
        return NextResponse.json({ error: 'uploadId, key, and partNumber are required' }, { status: 400 });
      }

      const command = new UploadPartCommand({
        Bucket: byosConfig.bucketName,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
      });

      const url = await getSignedUrl(client, command, { expiresIn: 3600 });

      return NextResponse.json({
        success: true,
        url,
      });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Failed to process presign request:', msg);
    return NextResponse.json({ error: `Internal Server Error: ${msg}` }, { status: 500 });
  }
}
