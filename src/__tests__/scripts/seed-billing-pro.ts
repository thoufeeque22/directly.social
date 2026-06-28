import { PrismaClient } from '@prisma/client';
import { SubscriptionTier } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const targetEmail = process.argv[2];
  if (!targetEmail) {
    console.error('Email required');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email: targetEmail } });
  if (user) {
    await prisma.billingProfile.upsert({
      where: { userId: user.id },
      update: { subscriptionTier: SubscriptionTier.CREATOR_PRO },
      create: { 
        userId: user.id, 
        subscriptionTier: SubscriptionTier.CREATOR_PRO,
        providerCustomerId: 'mock-cus-' + user.id
      }
    });
    console.log(`Successfully seeded CREATOR_PRO for ${targetEmail}`);
  } else {
    console.log(`User ${targetEmail} not found`);
  }
}

main().finally(() => prisma.$disconnect());
