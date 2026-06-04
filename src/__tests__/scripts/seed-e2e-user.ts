import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const testerEmail = 'tester@directly.social';
  const adminEmail = 'admin@directly.social';

  // 1. Ensure Tester exists and is a USER
  let tester = await prisma.user.findUnique({ where: { email: testerEmail } });
  if (tester) {
    await prisma.user.update({
      where: { email: testerEmail },
      data: { role: 'USER' },
    });
    console.log('Verified tester as USER role.');
  } else {
    tester = await prisma.user.create({
      data: {
        email: testerEmail,
        name: 'E2E Tester',
        role: 'USER',
      },
    });
    console.log('Created tester account with USER role.');
  }

  // 2. Create Admin
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'E2E Admin',
        role: 'ADMIN',
      },
    });
    console.log('Created admin account with ADMIN role.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
