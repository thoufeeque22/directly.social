import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Support command line args for targeted lazy seeding
  const targetEmail = process.argv[2];
  const targetRole = process.argv[3] as Role || 'USER';

  if (targetEmail) {
    console.log(`[Lazy Seed] Targeted seeding for ${targetEmail} as ${targetRole}`);
    const user = await prisma.user.upsert({
      where: { email: targetEmail },
      update: { role: targetRole },
      create: {
        email: targetEmail,
        name: targetEmail.split('@')[0],
        role: targetRole,
      },
    });

    // Seed a default Google account to allow platform interactions
    await prisma.account.upsert({
      where: { 
        provider_providerAccountId: { 
          provider: 'google', 
          providerAccountId: `e2e-google-${targetEmail}` 
        } 
      },
      update: { userId: user.id },
      create: {
        userId: user.id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: `e2e-google-${targetEmail}`,
        access_token: 'mock-token',
        accountName: 'E2E Google Account'
      }
    });
    
    return;
  }

  console.log('[Global Seed] Seeding legacy fallback users only...');

  // Ensure the legacy 'tester@directly.social' exists
  const legacyEmail = 'tester@directly.social';
  await prisma.user.upsert({
    where: { email: legacyEmail },
    update: { role: 'USER' },
    create: {
      email: legacyEmail,
      name: 'E2E Tester Legacy',
      role: 'USER',
    },
  });

  // Ensure the legacy 'admin@directly.social' exists
  const legacyAdminEmail = 'admin@directly.social';
  await prisma.user.upsert({
    where: { email: legacyAdminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: legacyAdminEmail,
      name: 'E2E Admin Legacy',
      role: 'ADMIN',
    },
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
