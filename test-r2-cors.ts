import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function testCors() {
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  });

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: 'test-cors-file.mp4',
    ContentType: 'video/mp4',
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  console.log("Presigned URL:", url);

  console.log("Sending OPTIONS preflight request from origin http://app.localhost:3000...");
  
  const response = await fetch(url, {
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://app.localhost:3000',
      'Access-Control-Request-Method': 'PUT',
      'Access-Control-Request-Headers': 'content-type'
    }
  });

  console.log("Status:", response.status);
  console.log("Access-Control-Allow-Origin:", response.headers.get('access-control-allow-origin'));
  console.log("Access-Control-Allow-Methods:", response.headers.get('access-control-allow-methods'));
  
  const text = await response.text();
  console.log("Response Body:", text);
}

testCors().catch(console.error);
