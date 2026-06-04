import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'tester@directly.social';

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`User ${email} not found. Please run seed-e2e-user.ts first.`);
    process.exit(1);
  }

  console.log(`Seeding schedule data for user: ${user.id}`);

  // Clear specific scheduled posts for a clean test state
  await prisma.postActivity.deleteMany({ 
    where: { 
      id: { in: ['e2e-post-1', 'e2e-post-2', 'e2e-post-3', 'e2e-search-1', 'e2e-search-2'] }
    } 
  });

  await prisma.galleryAsset.deleteMany({
    where: {
      fileId: { in: ['grand_canyon_vlog.mp4', 'pasta_tutorial.mov', 'smartphone_unboxing.mp4'] }
    }
  });

  // Seed Scheduled Posts
  const now = new Date();
  
  // Post 1: Scheduled in 1 hour
  const scheduled1 = new Date(now.getTime() + 60 * 60 * 1000);
  // Post 2: Scheduled in 2 hours
  const scheduled2 = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  // Post 3: Scheduled in 3 hours
  const scheduled3 = new Date(now.getTime() + 3 * 60 * 60 * 1000);

  // Search Data
  await prisma.postActivity.create({
    data: {
      id: 'e2e-search-1',
      userId: user.id,
      title: 'Exploring the Grand Canyon',
      description: 'A beautiful journey through the South Rim.',
      isPublished: true,
    }
  });

  await prisma.postActivity.create({
    data: {
      id: 'e2e-search-2',
      userId: user.id,
      title: 'Cooking Italian Pasta',
      description: 'Learn how to make authentic carbonara.',
      isPublished: true,
    }
  });

  // Media Gallery Data
  const farFuture = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  const fileIds = ['grand_canyon_vlog.mp4', 'pasta_tutorial.mov', 'smartphone_unboxing.mp4'];
  
  await prisma.galleryAsset.createMany({
    data: fileIds.map(fileId => ({
      userId: user.id,
      fileId,
      fileName: fileId,
      expiresAt: farFuture
    }))
  });

  // Create dummy physical files to satisfy AuditService
  const fs = await import('fs');
  const path = await import('path');
  const tempDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  for (const fileId of fileIds) {
    const filePath = path.join(tempDir, fileId);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, Buffer.from('dummy-e2e-content'));
      console.log(`Created dummy file: ${filePath}`);
    }
  }

  await prisma.postActivity.upsert({
    where: { id: 'e2e-post-1' },
    update: {
      userId: user.id,
      title: 'Scheduled Post 1',
      description: 'First scheduled post for E2E testing',
      scheduledAt: scheduled1,
      isPublished: false,
    },
    create: {
      id: 'e2e-post-1',
      userId: user.id,
      title: 'Scheduled Post 1',
      description: 'First scheduled post for E2E testing',
      scheduledAt: scheduled1,
      isPublished: false,
    }
  });

  await prisma.postActivity.upsert({
    where: { id: 'e2e-post-2' },
    update: {
      userId: user.id,
      title: 'Scheduled Post 2',
      description: 'Second scheduled post for E2E testing',
      scheduledAt: scheduled2,
      isPublished: false,
    },
    create: {
      id: 'e2e-post-2',
      userId: user.id,
      title: 'Scheduled Post 2',
      description: 'Second scheduled post for E2E testing',
      scheduledAt: scheduled2,
      isPublished: false,
    }
  });

  await prisma.postActivity.upsert({
    where: { id: 'e2e-post-3' },
    update: {
      userId: user.id,
      title: 'Scheduled Post 3',
      description: 'Third scheduled post for E2E testing',
      scheduledAt: scheduled3,
      isPublished: false,
    },
    create: {
      id: 'e2e-post-3',
      userId: user.id,
      title: 'Scheduled Post 3',
      description: 'Third scheduled post for E2E testing',
      scheduledAt: scheduled3,
      isPublished: false,
    }
  });

  console.log('Successfully seeded schedule data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
