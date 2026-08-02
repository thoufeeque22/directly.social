import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { LoginContent } from './LoginContent';
import { prisma } from '@/lib/core/prisma';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  let refCode = searchParams?.ref as string;
  
  const session = await auth();
  if (session) {
    redirect('/activity');
  }
  
  if (!refCode) {
    const cookieStore = await cookies();
    refCode = cookieStore.get('referralCode')?.value as string;
  }
  
  let referrerName = null;
  if (refCode) {
    let referrer = await prisma.user.findUnique({ where: { referralCode: refCode } });
    if (!referrer) {
      referrer = await prisma.user.findUnique({ where: { id: refCode } });
    }
    if (referrer?.name) {
      referrerName = referrer.name;
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent referrerName={referrerName} />
    </Suspense>
  );
}
