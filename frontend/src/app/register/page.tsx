'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/onboarding'); }, [router]);
  return <div className="min-h-screen bg-cream flex items-center justify-center">Redirecting...</div>;
}