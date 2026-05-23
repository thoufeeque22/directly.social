import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'tester@socialstudio.ai';
  const stableId = 'e2e-tester-id-stable';

  // Check if user already exists
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Create the E2E test user with a STABLE ID to avoid session de-sync
    user = await prisma.user.create({
      data: {
        id: stableId,
        email,
        name: 'E2E Tester',
        role: 'ADMIN',
      },
    });
    console.log(`Successfully created E2E test user with email: ${email} and stable ID: ${stableId} and ADMIN role.`);
  } else {
    console.log(`User with email ${email} already exists. Ensuring ADMIN role.`);
    user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    // Ensure the ID matches our stable ID (if it was created before we hardcoded it)
    if (user.id !== stableId) {
      console.warn(`[WARNING] Existing user has ID ${user.id}, but we expected ${stableId}.`);
      console.warn(`Consider deleting the user and re-seeding to avoid session de-sync.`);
    }
  }

  // Check if accounts already exist
  const existingAccounts = await prisma.account.findMany({
    where: { userId: user.id },
  });

  if (existingAccounts.length > 0) {
    console.log('User already has accounts. Skipping account creation.');
    return;
  }

  // Create accounts for the user
  await prisma.account.createMany({
    data: [
      {
        userId: user.id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: 'e2e-google-account',
        accountName: 'Tester Alpha',
      },
      {
        userId: user.id,
        type: 'oauth',
        provider: 'tiktok',
        providerAccountId: 'e2e-tiktok-account',
        accountName: 'Tester Beta',
      },
    ],
  });

  console.log('Successfully created accounts for the E2E test user.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
