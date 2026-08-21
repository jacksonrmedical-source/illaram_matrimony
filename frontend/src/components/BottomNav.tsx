'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function BottomNav() {
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken || pathname === '/onboarding') return null;

  const items = [
    { href: '/profiles', label: 'Discover', icon: '👤' },
    { href: '/interests', label: 'Interests', icon: '💌' },
    { href: '/chat', label: 'Messages', icon: '💬' },
    { href: '/profiles/edit', label: 'Profile', icon: '⚙️' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-50">
      <div className="flex justify-around py-2">
        {items.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center text-xs ${isActive ? 'text-primary font-semibold' : 'text-muted'}`}>
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}