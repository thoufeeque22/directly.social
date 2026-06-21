import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getByosConfig } from '@/lib/byos/service';
import { createS3Client } from '@/lib/upload/s3/client';
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { createByosAsset } from '@/lib/byos/complete-service';
import { z } from 'zod';

const registerSchema = z.object({
  key: z.string().min(1),
  fileName: z.string().min(1),
  fileSize: z.number().int().nonnegative(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const config = await getByosConfig(userId);
    if (!config) {
      return NextResponse.json({ error: 'BYOS not configured' }, { status: 400 });
    }

    const client = createS3Client({
      endpoint: config.endpoint || undefined,
      region: config.region ?? '',
      accessKeyId: config.accessKeyId ?? '',
      secretAccessKey: config.secretAccessKey ?? '',
    });

    try {
      await client.send(
        new HeadObjectCommand({
          Bucket: config.bucketName,
          Key: validated.key,
        })
      );
    } catch {
      return NextResponse.json({ error: 'Asset not found in S3 bucket' }, { status: 404 });
    }

    const asset = await createByosAsset(
      userId,
      {
        fileName: validated.fileName,
        fileSize: validated.fileSize,
        mimeType: 'video/mp4',
      },
      config.provider,
      config.bucketName,
      validated.key
    );

    return NextResponse.json({ success: true, fileId: asset.fileId });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to register BYOS asset' }, { status: 500 });
  }
}
