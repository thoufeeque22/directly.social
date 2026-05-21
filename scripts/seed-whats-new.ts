import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding What\'s New updates...');
  
  const updates = [
    {
      version: '1.0.0',
      title: 'Welcome to Social Studio',
      description: 'We are excited to have you here!'
    },
    {
      version: '1.1.0',
      title: 'New: AI Content Strategy',
      description: 'You can now use AI to generate multiple platform-specific titles and descriptions in one go!'
    },
    {
      version: '1.2.0',
      title: 'Performance Improvements',
      description: 'We have optimized the dashboard loading times and video analysis engine.'
    }
  ];

  for (const update of updates) {
    await prisma.updateLog.upsert({
      where: { id: `update-${update.version}` },
      update: update,
      create: {
        id: `update-${update.version}`,
        ...update
      }
    });
  }
  
  console.log('Successfully seeded update data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
