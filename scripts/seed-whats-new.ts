import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding What\'s New updates...');
  
  await prisma.updateLog.create({
    data: {
      version: '1.0.0',
      title: 'Welcome to Social Studio',
      description: 'We are excited to have you here!'
    }
  });
  
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
