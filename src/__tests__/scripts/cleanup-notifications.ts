import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'tester@directly.social' },
  });

  if (!user) {
    console.error('Test user not found');
    return;
  }

  await prisma.notification.deleteMany({
    where: { userId: user.id },
  });

  console.log('Cleanup notifications completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
