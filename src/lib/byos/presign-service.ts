import { S3Client, CreateMultipartUploadCommand, UploadPartCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { createS3Client } from '@/lib/upload/s3/client';

export const initializeUpload = async (client: S3Client, bucketName: string, fileName: string, pathPrefix?: string) => {
  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const s3Key = pathPrefix
    ? `${pathPrefix.replace(/\/$/, '')}/${Date.now()}-${randomUUID()}-${safeName}`
    : `uploads/${Date.now()}-${randomUUID()}-${safeName}`;

  const command = new CreateMultipartUploadCommand({ Bucket: bucketName, Key: s3Key });
  const response = await client.send(command);
  return { uploadId: response.UploadId, key: s3Key };
};

export const getPartPresignedUrl = async (client: S3Client, bucketName: string, key: string, uploadId: string, partNumber: number) => {
  const command = new UploadPartCommand({ Bucket: bucketName, Key: key, UploadId: uploadId, PartNumber: partNumber });
  return await getSignedUrl(client, command, { expiresIn: 3600 });
};
