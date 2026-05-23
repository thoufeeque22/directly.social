import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { encryptByos, decryptByos } from '@/lib/core/byos-encrypt';
import { S3Client, ListObjectsV2Command, S3ClientConfig } from '@aws-sdk/client-s3';
import { z } from 'zod';

const byosSchema = z.object({
  provider: z.enum(['S3', 'R2']),
  bucketName: z.string().min(1, 'Bucket name is required'),
  endpoint: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  accessKeyId: z.string().min(1, 'Access key ID is required'),
  secretAccessKey: z.string().min(1, 'Secret access key is required'),
  pathPrefix: z.string().default(''),
  keepFiles: z.boolean().default(true),
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

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await prisma.byosConfig.findUnique({
      where: { userId: session.user.id },
    });

    if (!config) {
      return NextResponse.json({ config: null });
    }

    let maskedAccessKey = '••••••••';
    try {
      const decrypted = decryptByos(config.accessKeyId);
      if (decrypted.length > 8) {
        maskedAccessKey = decrypted.substring(0, 4) + '...' + decrypted.substring(decrypted.length - 4);
      }
    } catch {
      // Ignored
    }

    return NextResponse.json({
      config: {
        provider: config.provider,
        bucketName: config.bucketName,
        endpoint: config.endpoint,
        region: config.region,
        accessKeyId: maskedAccessKey,
        secretAccessKey: '••••••••', // Always fully masked in GET
        pathPrefix: config.pathPrefix,
        keepFiles: config.keepFiles,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Failed to get BYOS config:', msg);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = byosSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const {
      provider,
      bucketName,
      endpoint,
      region,
      accessKeyId,
      secretAccessKey,
      pathPrefix,
      keepFiles,
    } = result.data;

    const existing = await prisma.byosConfig.findUnique({
      where: { userId: session.user.id },
    });

    let finalAccessKeyId = accessKeyId;
    let finalSecretAccessKey = secretAccessKey;

    if (existing) {
      if (accessKeyId.includes('...') || accessKeyId === '••••••••') {
        finalAccessKeyId = decryptByos(existing.accessKeyId);
      }
      if (secretAccessKey === '••••••••') {
        finalSecretAccessKey = decryptByos(existing.secretAccessKey);
      }
    }

    // Active Health Check - verify bucket access
    try {
      const client = createS3Client({
        provider,
        bucketName,
        endpoint,
        region,
        accessKeyId: finalAccessKeyId,
        secretAccessKey: finalSecretAccessKey,
      });

      // Verify connection by listing maximum 1 object
      await client.send(
        new ListObjectsV2Command({
          Bucket: bucketName,
          MaxKeys: 1,
        })
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('BYOS Health check failed:', msg);
      return NextResponse.json(
        {
          error: `Bucket connection check failed: ${msg}. Please ensure your credentials and CORS configurations are correct.`,
        },
        { status: 400 }
      );
    }

    const encryptedAccessKeyId = encryptByos(finalAccessKeyId);
    const encryptedSecretAccessKey = encryptByos(finalSecretAccessKey);

    const saved = await prisma.byosConfig.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        provider,
        bucketName,
        endpoint: endpoint || null,
        region: region || null,
        accessKeyId: encryptedAccessKeyId,
        secretAccessKey: encryptedSecretAccessKey,
        pathPrefix: pathPrefix || '',
        keepFiles,
      },
      update: {
        provider,
        bucketName,
        endpoint: endpoint || null,
        region: region || null,
        accessKeyId: encryptedAccessKeyId,
        secretAccessKey: encryptedSecretAccessKey,
        pathPrefix: pathPrefix || '',
        keepFiles,
      },
    });

    return NextResponse.json({
      success: true,
      config: {
        provider: saved.provider,
        bucketName: saved.bucketName,
        endpoint: saved.endpoint,
        region: saved.region,
        pathPrefix: saved.pathPrefix,
        keepFiles: saved.keepFiles,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Failed to save BYOS config:', msg);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.byosConfig.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Failed to delete BYOS config:', msg);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
