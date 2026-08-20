'use client';

import AuthGuard from '@/components/AuthGuard';

export default function InterestsPage() {
  return (
    <AuthGuard>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Interests</h1>
        <p>Your interests will appear here.</p>
      </div>
    </AuthGuard>
  );
}
