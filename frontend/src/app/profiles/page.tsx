'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { IndividualProfile } from '@/types';
import Link from 'next/link';

export default function ProfilesPage() {
  const { data, isLoading, error } = useQuery<{ results: IndividualProfile[] }>({
    queryKey: ['profiles'],
    queryFn: async () => {
      const response = await api.get('/profiles/individual-profiles/');
      return response.data;
    },
  });

  if (isLoading) return <div className="p-8">Loading profiles...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load profiles.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Browse Profiles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.results?.map((profile) => (
          <div key={profile.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{profile.full_name}</h2>
            <p className="text-sm text-gray-600">{profile.location_city}, {profile.location_country}</p>
            <p className="text-sm">{profile.profession || profile.education}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.verification_badges.map((badge) => (
                <span key={badge} className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs">{badge}</span>
              ))}
            </div>
            <Link href={`/profiles/${profile.id}`} className="mt-3 inline-block text-teal-600">View Profile</Link>
          </div>
        ))}
      </div>
    </div>
  );
}