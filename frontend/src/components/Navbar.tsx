'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AccountMenu from './AccountMenu';

export default function Navbar() {
  const { accessToken, hydrate } = useAuthStore();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);

  if (pathname === '/onboarding') return null;  // hide during onboarding

  const navItems = [
    { href: '/profiles', label: 'Discover' },
    { href: '/interests', label: 'Interests' },
    { href: '/chat', label: 'Messages' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-display text-xl font-bold text-primary">Illaram</Link>
        <div className="hidden md:flex items-center gap-6">
          {accessToken ? (
            <>
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} className={`text-sm font-medium transition ${isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-muted hover:text-primary'}`}>{item.label}</Link>
                );
              })}
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 text-sm font-medium text-muted hover:text-primary">
                  Profile
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </button>
                {menuOpen && <AccountMenu onClose={() => setMenuOpen(false)} />}
              </div>
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