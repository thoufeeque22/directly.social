import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'tester@socialstudio.ai' },
  });

  if (!user) {
    console.error('Test user not found');
    return;
  }

  // Clear existing notifications
  await prisma.notification.deleteMany({
    where: { userId: user.id },
  });

  // Create test notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        type: 'SUCCESS',
        message: 'Post successfully published to Twitter',
        isRead: false,
      },
      {
        userId: user.id,
        type: 'ERROR',
        message: 'Failed to upload video to YouTube',
        isRead: false,
      },
      {
        userId: user.id,
        type: 'INFO',
        message: 'AI Task: Title generation complete',
        isRead: true,
      },
      {
        userId: user.id,
        type: 'WARNING',
        message: 'Account connection expiring in 3 days',
        isRead: false,
      },
    ],
  });

  console.log('Seed notifications completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
