'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

interface AccountMenuProps {
  onClose: () => void;
}

export default function AccountMenu({ onClose }: AccountMenuProps) {
  const { logout } = useAuthStore();

  const items = [
    { href: '/profile/photos', label: 'Photos' },
    { href: '/profiles/edit', label: 'Edit Profile' },
    { href: '/premium', label: 'Premium' },
  ];

  return (
    <div
      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card border border-gray-100 py-2 z-50"
      onMouseLeave={onClose}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
          className="block px-4 py-2 text-sm text-muted hover:bg-primary-soft hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
      <button
        onClick={() => {
          onClose();
          logout();
          window.location.href = '/';
        }}
        className="block w-full text-left px-4 py-2 text-sm text-muted hover:bg-primary-soft hover:text-primary"
      >
        Logout
      </button>
    </div>
  );
}