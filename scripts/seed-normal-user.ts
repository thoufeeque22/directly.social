import { prisma } from '../src/lib/core/prisma';

async function main() {
  const email = process.argv[2] || 'tester-normal@directly.social';
  console.log(`🌱 Seeding normal user (no S3): ${email}`);

  let user = await prisma.user.findUnique({
    where: { email }
  });

  if (user) {
    // If the user exists, remove their BYOS configuration
    await prisma.byosConfig.deleteMany({
      where: { userId: user.id }
    });
  } else {
    // If the user doesn't exist, create them
    user = await prisma.user.create({
      data: {
        email,
        name: email.split('@')[0],
        role: 'USER',
      }
    });
  }

  console.log(`✅ Successfully seeded normal user (no S3) for ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
