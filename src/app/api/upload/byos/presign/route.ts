import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { uploadRateLimit, checkRateLimit } from '@/lib/core/ratelimit';
import { getByosConfig } from '@/lib/byos/service';
import { createS3Client } from '@/lib/upload/s3/client';
import { initializeUpload, getPartPresignedUrl } from '@/lib/byos/presign-service';
import { ByosPresignSchema } from '@/lib/schemas/byos-upload';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    await checkRateLimit(uploadRateLimit, userId, 'Upload limit reached');
    const body = await req.json();
    const result = ByosPresignSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    const config = await getByosConfig(userId);
    if (!config) return NextResponse.json({ error: 'BYOS not configured' }, { status: 400 });

    const client = createS3Client({ ...config, endpoint: config.endpoint || undefined, region: config.region || 'us-east-1' });
    const { action, fileName, fileSize, uploadId, key, partNumber } = result.data;

    if (action === 'initialize') {
      if (!fileSize) return NextResponse.json({ error: 'fileSize required' }, { status: 400 });
      const data = await initializeUpload(client, config.bucketName, fileName, config.pathPrefix || undefined);
      return NextResponse.json({ success: true, ...data });
    }

    if (!uploadId || !key || !partNumber) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    const url = await getPartPresignedUrl(client, config.bucketName, key, uploadId, partNumber);
    return NextResponse.json({ success: true, url });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Presign error:', msg);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
