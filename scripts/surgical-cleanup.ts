import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('SURGICAL CLEANUP STARTING...');
  
  const deletedSeen = await prisma.userSeenUpdate.deleteMany({});
  console.log(`Deleted ${deletedSeen.count} UserSeenUpdate records.`);
  
  const deletedLogs = await prisma.updateLog.deleteMany({});
  console.log(`Deleted ${deletedLogs.count} UpdateLog records.`);
  
  const stableUpdateId = 'update-1.0.0';
  await prisma.updateLog.create({
    data: {
      id: stableUpdateId,
      version: '1.0.0',
      title: 'Welcome to Social Studio',
      description: 'We are excited to have you here! (Cleaned)'
    }
  });
  console.log(`Created 1 fresh stable update: ${stableUpdateId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
