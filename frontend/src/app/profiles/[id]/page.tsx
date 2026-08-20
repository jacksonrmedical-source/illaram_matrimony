'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { IndividualProfile } from '@/types';
import { useState } from 'react';

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const profileId = params?.id as string;
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const { data: profile, isLoading, isError } = useQuery<IndividualProfile>({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      const response = await api.get(`/profiles/individual-profiles/${profileId}/`);
      return response.data;
    },
  });

  const sendInterestMutation = useMutation({
    mutationFn: async () => {
      setActionLoading(true);
      setError('');
      try {
        await api.post('/interests/interests/', { receiver: profileId });
      } finally {
        setActionLoading(false);
      }
    },
    onSuccess: () => {
      alert('Interest sent!');
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Failed to send interest');
    },
  });

  const requestPhotoMutation = useMutation({
    mutationFn: async () => {
      setActionLoading(true);
      setError('');
      try {
        await api.post(`/profiles/individual-profiles/${profileId}/request_photo/`);
      } finally {
        setActionLoading(false);
      }
    },
    onSuccess: () => {
      alert('Photo request sent!');
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Failed to request photo');
    },
  });

  if (isLoading) return <div className="p-8">Loading profile...</div>;
  if (isError || !profile) return <div className="p-8 text-red-500">Profile not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={() => router.back()} className="text-teal-600 mb-4">← Back</button>
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{profile.full_name}</h1>
          <div className="flex gap-2">
            {profile.verification_badges.map((badge) => (
              <span key={badge} className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs">{badge}</span>
            ))}
          </div>
        </div>
        <p className="text-gray-600">{profile.location_city}, {profile.location_state}, {profile.location_country}</p>
        <p className="text-sm text-gray-500">Last active: {new Date(profile.last_active).toLocaleDateString()}</p>
        <p className="text-sm text-gray-500">Profile completeness: {profile.completeness_score}%</p>

        <hr className="my-4" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Gender:</strong> {profile.gender}</div>
          <div><strong>Age:</strong> {new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()}</div>
          <div><strong>Education:</strong> {profile.education || '-'}</div>
          <div><strong>Profession:</strong> {profile.profession || '-'}</div>
          <div><strong>Diet:</strong> {profile.diet}</div>
          <div><strong>Spiritual:</strong> {profile.spiritual_orientation}</div>
          <div><strong>Family involvement:</strong> {profile.family_involvement}</div>
          <div><strong>Relocation:</strong> {profile.relocation_willingness}</div>
        </div>

        {profile.about_me && (
          <>
            <hr className="my-4" />
            <h2 className="font-semibold">About Me</h2>
            <p className="text-sm text-gray-700">{profile.about_me}</p>
          </>
        )}

        <hr className="my-4" />
        <div className="flex gap-4">
          <button
            onClick={() => sendInterestMutation.mutate()}
            disabled={actionLoading}
            className="bg-teal-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Send Interest
          </button>
          <button
            onClick={() => requestPhotoMutation.mutate()}
            disabled={actionLoading}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded disabled:opacity-50"
          >
            Request Photo
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}