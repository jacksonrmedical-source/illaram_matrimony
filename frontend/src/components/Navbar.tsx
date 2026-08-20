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
    <nav className="bg-teal-700 text-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg">Illaram</Link>
        <div className="flex gap-4 items-center">
          {accessToken ? (
            <>
              <Link href="/profiles" className="hover:underline">Browse Profiles</Link>
              <Link href="/interests" className="hover:underline">Interests</Link>
              <Link href="/chat" className="hover:underline">Chat</Link>
              <Link href="/profile/photos" className="hover:underline">My Photos</Link>
              <button onClick={handleLogout} className="bg-white text-teal-700 px-3 py-1 rounded hover:bg-gray-100">
                Logout
              </button>
            </>
          ) : (
             <>
             <Link href="/login" className="hover:underline">Login</Link>
             <Link href="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}