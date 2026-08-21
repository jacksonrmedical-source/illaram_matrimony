'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import LandingPage from '@/components/LandingPage';

export default function RootPage() {
  const router = useRouter();
  const { accessToken, hydrate } = useAuthStore();
  const [state, setState] = useState<'loading' | 'public' | 'redirecting'>('loading');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!accessToken) {
      setState('public');
      return;
    }

    let isMounted = true;
    api
      .get('/profiles/individual-profiles/me/')
      .then((response) => {
        if (!isMounted) return;
        const completed = response.data.onboarding_completed;
        if (completed) {
          router.replace('/profiles');
        } else {
          router.replace('/onboarding');
        }
        setState('redirecting');
      })
      .catch(() => {
        if (!isMounted) return;
        router.replace('/onboarding');
        setState('redirecting');
      });

    return () => { isMounted = false; };
  }, [accessToken, router]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-pulse text-peach">Loading...</div>
      </div>
    );
  }

  if (state === 'redirecting') {
    return null;
  }

  // Public landing page
  return <LandingPage />;
}