import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getByosConfig } from '@/lib/byos/service';
import { createS3Client } from '@/lib/upload/s3/client';
import { completeMultipartUpload, createByosAsset, upsertPostHistoryForByos } from '@/lib/byos/complete-service';
import { z } from 'zod';

const completeSchema = z.object({
  uploadId: z.string().min(1), key: z.string().min(1), fileName: z.string().min(1), fileSize: z.number().min(1),
  mimeType: z.string().optional(), parts: z.array(z.object({ PartNumber: z.number(), ETag: z.string() })).min(1),
  title: z.string().optional(), description: z.string().optional(), videoFormat: z.string().optional(),
  historyId: z.string().optional(), platforms: z.array(z.object({ platform: z.string(), accountId: z.string() })).optional(),
  scheduledAt: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const body = await req.json();
    const result = completeSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    const config = await getByosConfig(userId);
    if (!config) return NextResponse.json({ error: 'BYOS not configured' }, { status: 400 });

    const client = createS3Client({ ...config, endpoint: config.endpoint || undefined, region: config.region || 'us-east-1' });
    await completeMultipartUpload(client, config.bucketName, result.data.key, result.data.uploadId, result.data.parts);

    const asset = await createByosAsset(userId, result.data, config.provider, config.bucketName, result.data.key);
    const history = await upsertPostHistoryForByos(userId, asset.fileId, result.data);

    return NextResponse.json({ success: true, data: { fileId: asset.fileId, fileName: asset.fileName, historyId: history.id } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Complete error:', msg);
    return NextResponse.json({ error: `Upload completion failed: ${msg}` }, { status: 500 });
  }
}
