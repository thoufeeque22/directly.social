import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Support command line args for targeted seeding
  const targetEmail = process.argv[2];
  const targetRole = process.argv[3] as Role || 'USER';

  if (targetEmail) {
    console.log(`Targeted seeding for ${targetEmail} as ${targetRole}`);
    await prisma.user.upsert({
      where: { email: targetEmail },
      update: { role: targetRole },
      create: {
        email: targetEmail,
        name: targetEmail.split('@')[0],
        role: targetRole,
      },
    });
    return;
  }

  const adminEmail = 'admin@directly.social';

  // 1. Create multiple testers for parallel worker isolation
  const numTesters = 10;
  for (let i = 0; i < numTesters; i++) {
    const testerEmail = `tester-${i}@directly.social`;
    let tester = await prisma.user.findUnique({ where: { email: testerEmail } });
    if (tester) {
      await prisma.user.update({
        where: { email: testerEmail },
        data: { role: 'USER' },
      });
      console.log(`Verified ${testerEmail} as USER role.`);
    } else {
      tester = await prisma.user.create({
        data: {
          email: testerEmail,
          name: `E2E Tester ${i}`,
          role: 'USER',
        },
      });
      console.log(`Created ${testerEmail} account with USER role.`);
    }

    // 1b. Seed a default Google account for each tester to allow platform interactions
    await prisma.account.upsert({
      where: { 
        provider_providerAccountId: { 
          provider: 'google', 
          providerAccountId: `e2e-google-${testerEmail}` 
        } 
      },
      update: { userId: tester.id },
      create: {
        userId: tester.id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: `e2e-google-${testerEmail}`,
        access_token: 'mock-token',
        accountName: 'E2E Google Account'
      }
    });
  }

  // 2. Also ensure the legacy 'tester@directly.social' exists for backward compatibility
  const legacyEmail = 'tester@directly.social';
  let legacyTester = await prisma.user.findUnique({ where: { email: legacyEmail } });
  if (!legacyTester) {
    await prisma.user.create({
      data: {
        email: legacyEmail,
        name: 'E2E Tester Legacy',
        role: 'USER',
      },
    });
    console.log(`Created legacy ${legacyEmail} account.`);
  }

  // 3. Create multiple Admins
  const numAdmins = 10;
  for (let i = 0; i < numAdmins; i++) {
    const adminEmail = `admin-${i}@directly.social`;
    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          email: adminEmail,
          name: `E2E Admin ${i}`,
          role: 'ADMIN',
        },
      });
      console.log(`Created ${adminEmail} account with ADMIN role.`);
    }
  }

  // 4. Also ensure the legacy 'admin@directly.social' exists
  const legacyAdminEmail = 'admin@directly.social';
  let legacyAdmin = await prisma.user.findUnique({ where: { email: legacyAdminEmail } });
  if (!legacyAdmin) {
    await prisma.user.create({
      data: {
        email: legacyAdminEmail,
        name: 'E2E Admin Legacy',
        role: 'ADMIN',
      },
    });
    console.log(`Created legacy ${legacyAdminEmail} account.`);
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
