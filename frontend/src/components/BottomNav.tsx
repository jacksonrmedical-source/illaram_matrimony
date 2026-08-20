'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function BottomNav() {
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) return null;

  const items = [
    { href: '/profiles', label: 'Browse', icon: '👤' },
    { href: '/interests', label: 'Interests', icon: '💌' },
    { href: '/chat', label: 'Chat', icon: '💬' },
    { href: '/profile/photos', label: 'Photos', icon: '📸' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around py-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-xs ${
              pathname?.startsWith(item.href) ? 'text-teal-700 font-semibold' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}