import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { LoginContent } from './LoginContent';

export const metadata: Metadata = {
  title: "Login | Directly Social",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
