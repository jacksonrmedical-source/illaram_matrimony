'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }
  }, [accessToken, router]);

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}