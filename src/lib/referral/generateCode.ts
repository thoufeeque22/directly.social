import { prisma } from '@/lib/core/prisma';
import { headers } from 'next/headers';

export async function ensureReferralCode(user: { id: string; referralCode: string | null; name: string | null }) {
  let referralCode = user.referralCode;

  if (!referralCode) {
    const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const namePrefix = user.name ? `${slugify(user.name)}-` : '';
    
    let attempts = 0;
    while (attempts < 3) {
      try {
        const randomSuffix = Math.random().toString(36).substring(2, 2 + 6 + attempts);
        referralCode = `${namePrefix}${randomSuffix}`;
        await prisma.user.update({
          where: { id: user.id },
          data: { referralCode }
        });
        break;
      } catch (e: unknown) {
        attempts++;
        if (attempts >= 3) throw e;
      }
    }
  }

  if (!referralCode) throw new Error('Failed to generate referral code');

  const headersList = await headers();
  const host = headersList.get('host') || 'directly.social';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const referralUrl = `${protocol}://${host}/login?ref=${referralCode}`;

  return { referralCode, referralUrl };
}
