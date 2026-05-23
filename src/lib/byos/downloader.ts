import { prisma } from "@/lib/core/prisma";
import { decryptByos } from "@/lib/core/byos-encrypt";
import { S3Client, GetObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { logger } from "@/lib/core/logger";
import fsSync from "node:fs";
import path from "node:path";
import { createS3Client } from "@/lib/upload/s3/client";

export async function downloadByosFile(userId: string, fileId: string, destPath: string) {
  const asset = await prisma.galleryAsset.findFirst({
    where: { fileId, userId }
  });

  if (!asset) throw new Error(`Asset not found: ${fileId}`);

  const metadata = asset.metadata as { byos?: boolean; bucket: string; key: string } | null;
  if (!metadata?.byos) throw new Error(`Asset ${fileId} is not BYOS`);

  const { key } = metadata;
  const config = await prisma.byosConfig.findUnique({ where: { userId } });
  if (!config) throw new Error(`BYOS not configured for user ${userId}`);

  const decryptedAccessKeyId = decryptByos(config.accessKeyId);
  const decryptedSecretAccessKey = decryptByos(config.secretAccessKey);

  const client = createS3Client({
    endpoint: config.endpoint || undefined,
    region: config.region || "us-east-1",
    accessKeyId: decryptedAccessKeyId,
    secretAccessKey: decryptedSecretAccessKey,
  });

  logger.info(`🌐 [BYOS STREAM] Downloading ${key}...`);
  const response = await client.send(new GetObjectCommand({
    Bucket: config.bucketName,
    Key: key
  }));

  if (!response.Body) throw new Error("S3 response body is empty");

  await fsSync.promises.mkdir(path.dirname(destPath), { recursive: true });
  const writeStream = fsSync.createWriteStream(destPath);
  await pipeline(response.Body as Readable, writeStream);
  
  logger.info(`✅ [BYOS STREAM] Downloaded to: ${destPath}`);
}
