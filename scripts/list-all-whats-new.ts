import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { seenUpdates: true }
      }
    }
  });

  console.log(`Found ${users.length} users:`);
  users.forEach(u => {
    console.log(`- User: ${u.name} (${u.email}), ID: ${u.id}, Seen Updates: ${u._count.seenUpdates}`);
  });

  const updates = await prisma.updateLog.findMany({
    include: {
      _count: {
        select: { seenBy: true }
      }
    }
  });

  console.log(`\nFound ${updates.length} updates:`);
  updates.forEach(u => {
    console.log(`- Update: ${u.title} (ID: ${u.id}), Seen By: ${u._count.seenBy}`);
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
