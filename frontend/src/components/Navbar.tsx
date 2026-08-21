'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const { accessToken, logout, hydrate } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-2xl text-primary">Illaram</Link>
        <div className="flex gap-6 items-center">
          {accessToken ? (
            <>
              <Link href="/profiles" className="text-sm font-medium text-charcoal hover:text-primary">Discover</Link>
              <Link href="/interests" className="text-sm font-medium text-charcoal hover:text-primary">Interests</Link>
              <Link href="/chat" className="text-sm font-medium text-charcoal hover:text-primary">Messages</Link>
              <Link href="/profile/photos" className="text-sm font-medium text-charcoal hover:text-primary">Photos</Link>
              <Link href="/profiles/edit" className="text-sm font-medium text-charcoal hover:text-primary">Profile</Link>
              <Link href="/premium" className="text-sm font-medium text-accent hover:text-accent/80">Premium</Link>
              <button onClick={handleLogout} className="text-sm text-muted hover:text-charcoal">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-primary hover:text-primary-dark">Login</Link>
              <Link href="/register" className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-dark">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}