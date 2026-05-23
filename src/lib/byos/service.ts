import { byosConfigSchema } from './validation';
import { prisma } from '@/lib/core/prisma';
import { decryptByos, encryptByos } from '@/lib/core/byos-encrypt';

export const saveByosConfig = async (userId: string, data: unknown) => {
  const validated = byosConfigSchema.parse(data);
  const encryptedSecret = encryptByos(validated.secretAccessKey);

  return await prisma.byosConfig.upsert({
    where: { userId },
    update: { ...validated, secretAccessKey: encryptedSecret },
    create: { userId, ...validated, secretAccessKey: encryptedSecret },
  });
};

export const getByosConfig = async (userId: string) => {
  const config = await prisma.byosConfig.findUnique({ where: { userId } });
  if (!config) return null;
  
  return {
    ...config,
    secretAccessKey: decryptByos(config.secretAccessKey),
  };
};
