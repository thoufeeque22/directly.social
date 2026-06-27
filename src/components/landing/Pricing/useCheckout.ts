import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useCheckout = () => {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const isAuthenticated = status === 'authenticated';

  const handleCheckout = async (tierId: string) => {
    if (!isAuthenticated) {
      router.push('/login?callbackUrl=/pricing');
      return;
    }

    if (!tierId) return;

    if (tierId.startsWith('free-')) {
      router.push('/');
      return;
    }

    try {
      setIsLoading(tierId);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error(data.error);
        setIsLoading(null);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(null);
    }
  };

  return { handleCheckout, isLoading, isAuthenticated };
};
