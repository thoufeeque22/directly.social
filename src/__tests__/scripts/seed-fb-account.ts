import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) throw new Error('Email required');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error(`User ${email} not found`);

  await prisma.account.upsert({
    where: { 
      provider_providerAccountId: { 
        provider: 'facebook', 
        providerAccountId: `e2e-fb-${email}` 
      } 
    },
    update: { userId: user.id },
    create: {
      userId: user.id,
      type: 'oauth',
      provider: 'facebook',
      providerAccountId: `e2e-fb-${email}`,
      access_token: 'mock-token',
      accountName: 'E2E FB Account'
    }
  });
  
  console.log(`✅ Seeded Facebook account for ${email}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
