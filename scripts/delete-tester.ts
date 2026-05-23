import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'tester@socialstudio.ai';
  console.log(`Searching for user with email ${email}...`);
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    console.log(`Deleting user: ${user.id}...`);
    await prisma.user.delete({
      where: { email },
    });
    console.log('User deleted successfully.');
  } else {
    console.log('User not found.');
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
