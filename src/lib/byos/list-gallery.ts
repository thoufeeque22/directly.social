/* eslint-disable max-lines */
import { prisma } from '@/lib/core/prisma';
import { getByosConfig } from '@/lib/byos/service';
import { createS3Client } from '@/lib/upload/s3/client';
import { ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface ByosMetadata {
  key?: string;
  byos?: boolean;
}

export async function listByosGallery(userId: string, continuationToken?: string | null, limit = 12) {
  const config = await getByosConfig(userId);
  if (!config) throw new Error('BYOS not configured');

  let s3Token: string | undefined = undefined;
  let offset = 0;
  if (continuationToken) {
    try {
      const decoded = JSON.parse(Buffer.from(continuationToken, 'base64').toString('utf8'));
      s3Token = decoded.s3Token || undefined;
      offset = decoded.offset || 0;
    } catch {
      // Fallback
    }
  }

  if (config.endpoint === 'mock://s3') {
    // Generate 15 mock items
    const mockVideos = Array.from({ length: 15 }, (_, i) => {
      const id = i + 1;
      const key = `mock-video-${id}.mp4`;
      return {
        Key: key,
        Size: 10 * 1024 * 1024 * id, // 10MB, 20MB...
        LastModified: new Date(Date.now() - id * 24 * 60 * 60 * 1000),
      };
    });

    const registered = await prisma.galleryAsset.findMany({
      where: {
        userId,
        metadata: { path: ['byos'], equals: true },
      },
    });

    const registeredMap = new Map<string, string>(
      registered
        .map((asset) => {
          const meta = asset.metadata as unknown as ByosMetadata;
          return meta?.key ? [meta.key, asset.fileId] : null;
        })
        .filter((item): item is [string, string] => item !== null)
    );

    const slicedVideos = mockVideos.slice(offset, offset + limit);
    const data = slicedVideos.map((obj) => {
      const key = obj.Key;
      const testVideos = [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      ];
      const videoIndex = (parseInt(key.split('-')[2]) || 1) % testVideos.length;
      const previewUrl = testVideos[videoIndex];

      return {
        key,
        fileName: key,
        fileSize: obj.Size,
        lastModified: obj.LastModified.toISOString(),
        status: registeredMap.has(key) ? 'Cloud' : 'External',
        fileId: registeredMap.get(key) || null,
        previewUrl,
      };
    });

    let nextContinuationToken: string | null = null;
    let hasNextPage = false;
    if (offset + limit < mockVideos.length) {
      nextContinuationToken = Buffer.from(JSON.stringify({ s3Token: null, offset: offset + limit })).toString('base64');
      hasNextPage = true;
    }

    return { data, nextContinuationToken, hasNextPage };
  }

  const client = createS3Client({
    endpoint: config.endpoint || undefined,
    region: config.region ?? '',
    accessKeyId: config.accessKeyId ?? '',
    secretAccessKey: config.secretAccessKey ?? '',
  });

  const s3Response = await client.send(
    new ListObjectsV2Command({
      Bucket: config.bucketName,
      Prefix: config.pathPrefix || undefined,
      ContinuationToken: s3Token,
      MaxKeys: 100,
    })
  );

  const objects = s3Response.Contents || [];
  const videoObjects = objects.filter((obj) => {
    const key = obj.Key;
    if (!key) return false;
    return /\.(mp4|mov|webm|avi|mkv)$/i.test(key);
  });

  const registered = await prisma.galleryAsset.findMany({
    where: {
      userId,
      metadata: { path: ['byos'], equals: true },
    },
  });

  const registeredMap = new Map<string, string>(
    registered
      .map((asset) => {
        const meta = asset.metadata as unknown as ByosMetadata;
        return meta?.key ? [meta.key, asset.fileId] : null;
      })
      .filter((item): item is [string, string] => item !== null)
  );

  const slicedVideos = videoObjects.slice(offset, offset + limit);
  const data = await Promise.all(
    slicedVideos.map(async (obj) => {
      const key = obj.Key!;
      const previewUrl = await getSignedUrl(
        client,
        new GetObjectCommand({ Bucket: config.bucketName, Key: key }),
        { expiresIn: 7200 }
      );
      return {
        key,
        fileName: key.split('/').pop() || key,
        fileSize: obj.Size || 0,
        lastModified: obj.LastModified ? obj.LastModified.toISOString() : new Date().toISOString(),
        status: registeredMap.has(key) ? 'Cloud' : 'External',
        fileId: registeredMap.get(key) || null,
        previewUrl,
      };
    })
  );

  let nextContinuationToken: string | null = null;
  let hasNextPage = false;
  if (offset + limit < videoObjects.length) {
    nextContinuationToken = Buffer.from(JSON.stringify({ s3Token, offset: offset + limit })).toString('base64');
    hasNextPage = true;
  } else if (s3Response.NextContinuationToken) {
    nextContinuationToken = Buffer.from(JSON.stringify({ s3Token: s3Response.NextContinuationToken, offset: 0 })).toString('base64');
    hasNextPage = true;
  }
  return { data, nextContinuationToken, hasNextPage };
}
