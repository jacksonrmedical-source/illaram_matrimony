'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { IndividualProfile } from '@/types';
import { useState } from 'react';

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
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
    onSuccess: () => alert('Interest sent!'),
    onError: (err: any) => setError(err.response?.data?.detail || 'Failed to send interest'),
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
    onSuccess: () => alert('Photo request sent!'),
    onError: (err: any) => setError(err.response?.data?.detail || 'Failed to request photo'),
  });

  const startConversationMutation = useMutation({
    mutationFn: async () => {
      setActionLoading(true);
      setError('');
      try {
        const response = await api.post('/chat/conversations/', { participant_id: profileId });
        return response.data;
      } finally {
        setActionLoading(false);
      }
    },
    onSuccess: (data) => router.push(`/chat?conversation_id=${data.id}`),
    onError: (err: any) => setError(err.response?.data?.detail || 'Failed to start conversation'),
  });

  if (isLoading) return <div className="p-8 text-center text-muted">Loading profile...</div>;
  if (isError || !profile) return <div className="p-8 text-center text-red-500">Profile not found.</div>;

  const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <button onClick={() => router.back()} className="text-primary hover:text-primary-dark mb-6">← Back</button>

      <div className="bg-white rounded-3xl shadow-card overflow-hidden animate-fade-in">
        {/* Photo area */}
        <div className="h-72 bg-gradient-to-br from-primary-soft to-primary/20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-3">🔒</div>
            <p className="text-primary font-medium">Private photo</p>
            <p className="text-sm text-muted mt-1">Visible after mutual interest</p>
          </div>
        </div>

        {/* Main info */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-charcoal">{profile.full_name}</h1>
              <p className="text-muted">{profile.location_city}, {profile.location_state}, {profile.location_country}</p>
            </div>
            <div className="flex gap-2">
              {profile.verification_badges.map((badge) => (
                <span key={badge} className="bg-primary-soft text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {badge.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="bg-gray-100 px-3 py-1 rounded-full">{age} yrs</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">{profile.diet}</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">{profile.profession || profile.education}</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">{profile.spiritual_orientation}</span>
          </div>

          {/* About */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700">{profile.about_me || 'No description yet.'}</p>
          </div>

          {/* Details */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm text-muted">Education</h3>
              <p className="text-charcoal">{profile.education || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted">Profession</h3>
              <p className="text-charcoal">{profile.profession || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted">Family Involvement</h3>
              <p className="text-charcoal">{profile.family_involvement}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted">Relocation</h3>
              <p className="text-charcoal">{profile.relocation_willingness}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => sendInterestMutation.mutate()}
              disabled={actionLoading}
              className="flex-1 bg-primary text-white py-3 rounded-xl hover:bg-primary-dark font-medium"
            >
              Send Interest
            </button>
            <button
              onClick={() => requestPhotoMutation.mutate()}
              disabled={actionLoading}
              className="flex-1 bg-white border border-primary text-primary py-3 rounded-xl hover:bg-primary-soft font-medium"
            >
              Request Photo
            </button>
            <button
              onClick={() => startConversationMutation.mutate()}
              disabled={actionLoading}
              className="flex-1 bg-accent text-white py-3 rounded-xl hover:bg-accent/80 font-medium"
            >
              Message
            </button>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}