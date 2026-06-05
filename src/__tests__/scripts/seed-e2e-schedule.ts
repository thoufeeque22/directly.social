import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const numTesters = 10;
  const emails = Array.from({ length: numTesters }, (_, i) => `tester-${i}@directly.social`);
  emails.push('tester@directly.social'); // Include legacy

  for (const email of emails) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.warn(`User ${email} not found. Skipping schedule seeding for this user.`);
      continue;
    }

    console.log(`Seeding schedule data for user: ${email} (${user.id})`);

    const workerSuffix = email === 'tester@directly.social' ? 'legacy' : email.split('@')[0].split('-')[1];
    const getWorkerId = (baseId: string) => `${baseId}-${workerSuffix}`;

    const workerIds = [
      getWorkerId('e2e-post-1'),
      getWorkerId('e2e-post-2'),
      getWorkerId('e2e-post-3'),
      getWorkerId('e2e-search-1'),
      getWorkerId('e2e-search-2')
    ];

    // Clear specific scheduled posts for a clean test state
    await prisma.postActivity.deleteMany({ 
      where: { 
        id: { in: workerIds }
      } 
    });

    // Seed Search Data
    await prisma.postActivity.create({
      data: {
        id: getWorkerId('e2e-search-1'),
        userId: user.id,
        title: 'Exploring the Grand Canyon',
        description: 'A beautiful journey through the South Rim.',
        isPublished: true,
      }
    });

    await prisma.postActivity.create({
      data: {
        id: getWorkerId('e2e-search-2'),
        userId: user.id,
        title: 'Cooking Italian Pasta',
        description: 'Learn how to make authentic carbonara.',
        isPublished: true,
      }
    });

    // Media Gallery Data
    const now = new Date();
    const farFuture = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    const fileIds = ['grand_canyon_vlog.mp4', 'pasta_tutorial.mov', 'smartphone_unboxing.mp4'].map(id => `${id}-${workerSuffix}`);
    
    await prisma.galleryAsset.deleteMany({
      where: { fileId: { in: fileIds } }
    });

    await prisma.galleryAsset.createMany({
      data: fileIds.map(fileId => ({
        userId: user.id,
        fileId,
        fileName: fileId.replace(`-${workerSuffix}`, ''),
        expiresAt: farFuture
      }))
    });

    // Seed Scheduled Posts
    const scheduled1 = new Date(now.getTime() + 60 * 60 * 1000);
    const scheduled2 = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const scheduled3 = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    await prisma.postActivity.create({
      data: {
        id: getWorkerId('e2e-post-1'),
        userId: user.id,
        title: 'Scheduled Post 1',
        description: 'First scheduled post for E2E testing',
        scheduledAt: scheduled1,
        isPublished: false,
      }
    });

    await prisma.postActivity.create({
      data: {
        id: getWorkerId('e2e-post-2'),
        userId: user.id,
        title: 'Scheduled Post 2',
        description: 'Second scheduled post for E2E testing',
        scheduledAt: scheduled2,
        isPublished: false,
      }
    });

    await prisma.postActivity.create({
      data: {
        id: getWorkerId('e2e-post-3'),
        userId: user.id,
        title: 'Scheduled Post 3',
        description: 'Third scheduled post for E2E testing',
        scheduledAt: scheduled3,
        isPublished: false,
      }
    });
  }

  console.log('Successfully seeded schedule data for all workers.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
