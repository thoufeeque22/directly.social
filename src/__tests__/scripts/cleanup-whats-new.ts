import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up duplicate/test What\'s New updates...');
  
  // Delete all UserSeenUpdate records to start fresh for this test
  await prisma.userSeenUpdate.deleteMany({});
  
  // Keep only the stable update-1.0.0
  await prisma.updateLog.deleteMany({
    where: {
      id: { not: 'update-1.0.0' }
    }
  });

  console.log('Cleanup complete. Database is now in a clean state with only 1 stable update.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
