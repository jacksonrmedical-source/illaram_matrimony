'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [hasCompleted, setHasCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
      return;
    }

    // Allow the onboarding page itself without checking
    if (pathname === '/onboarding') {
      setHasCompleted(true);
      return;
    }

    let isMounted = true;
    api
      .get('/profiles/individual-profiles/me/')
      .then((response) => {
        if (isMounted) {
          const completed = response.data.onboarding_completed;
          if (completed) {
            setHasCompleted(true);
          } else {
            router.push('/onboarding');
            setHasCompleted(false);
          }
        }
      })
      .catch((error) => {
        if (isMounted) {
          if (error.response?.status === 404) {
            router.push('/onboarding');
            setHasCompleted(false);
          } else {
            setHasCompleted(false);
          }
        }
      });

    return () => { isMounted = false; };
  }, [accessToken, pathname, router]);

  if (!accessToken || hasCompleted === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-pulse text-peach">Loading...</div>
      </div>
    );
  }

  if (hasCompleted === false) {
    return null;
  }

  return <>{children}</>;
}