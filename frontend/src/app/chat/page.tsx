'use client';

import AuthGuard from '@/components/AuthGuard';

export default function ChatPage() {
  return (
    <AuthGuard>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Chat</h1>
        <p>Your conversations will appear here.</p>
      </div>
    </AuthGuard>
  );
}
