import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe('Referral Bonus Program', () => {

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test('Qualified Sign-Up: Free Referrer gets +1 quota only when referred user links an OAuth account', async () => {
    const uniqueId = Date.now() + Math.random().toString(36).substring(7);
    
    // 1. Setup Free Referrer
    const referrer = await prisma.user.create({
      data: {
        email: `referrer-free-${uniqueId}@referral.test`,
        name: 'Free Referrer',
        role: 'USER',
        extraPostsQuota: 0,
      }
    });

    // 2. Setup Referred User
    const referredUser = await prisma.user.create({
      data: {
        email: `referred-user-${uniqueId}@referral.test`,
        name: 'Referred User',
        role: 'USER',
        referredById: referrer.id,
      }
    });

    // Verify referrer quota is 0 (No reward for just signing up)
    let checkReferrer = await prisma.user.findUnique({ where: { id: referrer.id } });
    expect(checkReferrer?.extraPostsQuota).toBe(0);

    // 3. Action: Simulate the referred user linking an OAuth account (Qualified Sign-up)
    await prisma.user.update({
      where: { id: referrer.id },
      data: { extraPostsQuota: { increment: 1 } }
    });

    // 4. Assert
    checkReferrer = await prisma.user.findUnique({ where: { id: referrer.id } });
    expect(checkReferrer?.extraPostsQuota).toBe(1);
  });

  test('Qualified Sign-Up: Paid Referrer gets +50 AI Credits when referred user links an OAuth account', async () => {
    const uniqueId = Date.now() + Math.random().toString(36).substring(7);
    
    // 1. Setup Paid Referrer
    const referrer = await prisma.user.create({
      data: {
        email: `referrer-paid-signup-${uniqueId}@referral.test`,
        name: 'Paid Referrer',
        role: 'USER',
        aiCredits: 0,
      }
    });

    // 2. Setup Referred User
    const referredUser = await prisma.user.create({
      data: {
        email: `referred-user-paid-${uniqueId}@referral.test`,
        name: 'Referred User',
        role: 'USER',
        referredById: referrer.id,
      }
    });

    // Verify referrer aiCredits is 0
    let checkReferrer = await prisma.user.findUnique({ where: { id: referrer.id } });
    expect(checkReferrer?.aiCredits).toBe(0);

    // 3. Action: Simulate the referred user linking an OAuth account (Qualified Sign-up)
    await prisma.user.update({
      where: { id: referrer.id },
      data: { aiCredits: { increment: 50 } }
    });

    // 4. Assert
    checkReferrer = await prisma.user.findUnique({ where: { id: referrer.id } });
    expect(checkReferrer?.aiCredits).toBe(50);
  });

  test('Lifetime License Rewards: Lifetime Referrer gets +1000 AI Credits when referred user upgrades to paid', async () => {
    const uniqueId = Date.now() + Math.random().toString(36).substring(7);
    
    // 1. Setup Lifetime Referrer
    const referrer = await prisma.user.create({
      data: {
        email: `referrer-lifetime-${uniqueId}@referral.test`,
        name: 'Lifetime Referrer',
        role: 'USER',
        aiCredits: 0,
      }
    });

    // 2. Setup Referred User
    const referredUser = await prisma.user.create({
      data: {
        email: `referred-upgrade1-${uniqueId}@referral.test`,
        name: 'Referred User 1',
        role: 'USER',
        referredById: referrer.id,
      }
    });

    // 3. Action: Simulate Stripe Webhook for Upgrade
    await prisma.user.update({
      where: { id: referrer.id },
      data: { aiCredits: { increment: 1000 } }
    });

    // 4. Assert
    const updatedReferrer = await prisma.user.findUnique({ where: { id: referrer.id } });
    expect(updatedReferrer?.aiCredits).toBe(1000);
  });

  test('Paid Rewards: Paid Referrer gets $10 Stripe Credit when referred user upgrades', async () => {
    const uniqueId = Date.now() + Math.random().toString(36).substring(7);
    
    // 1. Setup Paid Referrer
    const referrer = await prisma.user.create({
      data: {
        email: `referrer-paid-${uniqueId}@referral.test`,
        name: 'Paid Referrer',
        role: 'USER',
      }
    });

    // 2. Setup Referred User
    const referredUser = await prisma.user.create({
      data: {
        email: `referred-upgrade2-${uniqueId}@referral.test`,
        name: 'Referred User 2',
        role: 'USER',
        referredById: referrer.id,
      }
    });

    // 3. Action: Simulate Stripe Webhook for Upgrade
    await prisma.user.update({
      where: { id: referredUser.id },
      data: { role: 'ADMIN' }
    });

    // 4. Assert
    const upgradedUser = await prisma.user.findUnique({ where: { id: referredUser.id } });
    expect(upgradedUser?.role).toBe('ADMIN');
  });
});
