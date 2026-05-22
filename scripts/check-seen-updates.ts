import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'tester@socialstudio.ai';
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  const seenUpdates = await prisma.userSeenUpdate.findMany({
    where: { userId: user.id },
    include: { update: true }
  });

  console.log(`User ${user.id} has seen ${seenUpdates.length} updates:`);
  seenUpdates.forEach(s => {
    console.log(`- ${s.update.title} (ID: ${s.updateId}) at ${s.seenAt}`);
  });

  const allUpdates = await prisma.updateLog.findMany();
  console.log(`\nTotal updates in DB: ${allUpdates.length}`);
  allUpdates.forEach(u => {
    const isSeen = seenUpdates.some(s => s.updateId === u.id);
    console.log(`- [${isSeen ? 'SEEN' : 'UNSEEN'}] ${u.title} (ID: ${u.id})`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
