import { prisma } from '../src/lib/core/prisma';
import { saveByosConfig } from '../src/lib/byos/service';

async function main() {
  const email = process.argv[2] || 'tester@directly.social';
  console.log(`🌱 Seeding user: ${email}`);

  let user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: email.split('@')[0],
        role: 'USER',
      }
    });
  }

  await saveByosConfig(user.id, {
    provider: 'S3',
    bucketName: 'mock-bucket',
    endpoint: 'mock://s3',
    region: 'us-east-1',
    accessKeyId: 'mock-access-key',
    secretAccessKey: 'mock-secret-key',
    pathPrefix: '',
    keepFiles: true,
  });

  console.log(`✅ Successfully seeded BYOS mock configuration for ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
