'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { encrypt, decrypt } from '@/lib/core/encryption';

export async function saveByokCredential(data: {
  platform: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  return await prisma.byokCredential.upsert({
    where: { userId_platform: { userId: session.user.id, platform: data.platform } },
    update: {
      clientId: data.clientId,
      clientSecret: encrypt(data.clientSecret),
      redirectUri: data.redirectUri,
    },
    create: {
      userId: session.user.id,
      platform: data.platform,
      clientId: data.clientId,
      clientSecret: encrypt(data.clientSecret),
      redirectUri: data.redirectUri,
    },
  });
}

export async function getByokCredential(platform: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const cred = await prisma.byokCredential.findUnique({
    where: { userId_platform: { userId: session.user.id, platform } },
  });

  if (!cred) return null;

  return {
    ...cred,
    clientSecret: decrypt(cred.clientSecret),
  };
}
