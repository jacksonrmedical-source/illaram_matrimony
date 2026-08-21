'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { IndividualProfile } from '@/types';
import { useState } from 'react';

interface Interest {
  id: string;
  sender: string;
  receiver: string;
  status: string;
  photo_request: boolean;
  created_at: string;
}

function computeCompatibility(myProfile: IndividualProfile, other: IndividualProfile): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  let total = 0;

  const fieldsToCompare = [
    { key: 'diet', label: 'Diet' },
    { key: 'spiritual_orientation', label: 'Spiritual orientation' },
    { key: 'family_involvement', label: 'Family involvement' },
    { key: 'relocation_willingness', label: 'Relocation' },
    { key: 'tamil_language_importance', label: 'Tamil language' },
  ];

  fieldsToCompare.forEach((field) => {
    total++;
    const myVal = (myProfile as any)[field.key];
    const otherVal = (other as any)[field.key];
    if (myVal && otherVal && myVal === otherVal) {
      score++;
      reasons.push(field.label);
    }
  });

  total++;
  if (myProfile.location_city === other.location_city) {
    score++;
    reasons.push('Same city');
  }

  if (myProfile.caste && other.caste && myProfile.caste === other.caste) {
    score++;
    reasons.push('Same caste');
    total++;
  }

  const percent = Math.round((score / total) * 100);
  return { score: percent, reasons };
}

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const profileId = params?.id as string;
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const { data: myProfile } = useQuery<IndividualProfile>({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const response = await api.get('/profiles/individual-profiles/me/');
      return response.data;
    },
  });

  const { data: profile, isLoading, isError } = useQuery<IndividualProfile>({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      const response = await api.get(`/profiles/individual-profiles/${profileId}/`);
      return response.data;
    },
  });

  const { data: interestsData } = useQuery<{ results: Interest[] }>({
    queryKey: ['interests'],
    queryFn: async () => {
      const response = await api.get('/interests/interests/');
      return response.data;
    },
  });

  const interests = interestsData?.results || [];
  const sentInterest = interests.find(i => i.sender === myProfile?.id && i.receiver === profileId && i.status === 'sent');
  const receivedInterest = interests.find(i => i.receiver === myProfile?.id && i.sender === profileId && i.status === 'sent');
  const mutualInterest = interests.find(i => i.status === 'accepted' && ((i.sender === myProfile?.id && i.receiver === profileId) || (i.sender === profileId && i.receiver === myProfile?.id)));

  const sendInterestMutation = useMutation({
    mutationFn: async () => {
      setActionLoading(true);
      await api.post('/interests/interests/', { receiver: profileId });
    },
    onSuccess: () => {
      setActionLoading(false);
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
    onError: (err: any) => {
      setActionLoading(false);
      setError(err.response?.data?.detail || 'Failed to send interest');
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async () => {
      setActionLoading(true);
      await api.post(`/interests/interests/${receivedInterest?.id}/accept/`);
    },
    onSuccess: () => {
      setActionLoading(false);
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
    onError: (err: any) => {
      setActionLoading(false);
      setError(err.response?.data?.detail || 'Failed to accept');
    },
  });

  const declineMutation = useMutation({
    mutationFn: async () => {
      setActionLoading(true);
      await api.post(`/interests/interests/${receivedInterest?.id}/decline/`);
    },
    onSuccess: () => {
      setActionLoading(false);
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
    onError: (err: any) => {
      setActionLoading(false);
      setError(err.response?.data?.detail || 'Failed to decline');
    },
  });

  const startConversationMutation = useMutation({
    mutationFn: async () => {
      setActionLoading(true);
      const response = await api.post('/chat/conversations/', { participant_id: profileId });
      return response.data;
    },
    onSuccess: (data) => {
      setActionLoading(false);
      router.push(`/chat?conversation_id=${data.id}`);
    },
    onError: (err: any) => {
      setActionLoading(false);
      setError(err.response?.data?.detail || 'Failed to start conversation');
    },
  });

  const requestPhotoMutation = useMutation({
    mutationFn: async () => {
      setActionLoading(true);
      await api.post(`/profiles/individual-profiles/${profileId}/request_photo/`);
    },
    onSuccess: () => {
      setActionLoading(false);
      alert('Photo request sent!');
    },
    onError: (err: any) => {
      setActionLoading(false);
      setError(err.response?.data?.detail || 'Failed to request photo');
    },
  });

  if (isLoading || !myProfile || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-pulse text-peach">Loading profile...</div>
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500">Profile not found.</div>;
  }

  const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear();
  const compatibility = computeCompatibility(myProfile, profile);

  // Primary action based on state
  let primaryAction;
  if (mutualInterest) {
    primaryAction = (
      <button
        onClick={() => startConversationMutation.mutate()}
        disabled={actionLoading}
        className="flex-1 bg-peach text-white py-3 rounded-xl font-medium disabled:opacity-50"
      >
        Message
      </button>
    );
  } else if (receivedInterest) {
    primaryAction = (
      <>
        <button
          onClick={() => acceptMutation.mutate()}
          disabled={actionLoading}
          className="flex-1 bg-peach text-white py-3 rounded-xl font-medium disabled:opacity-50"
        >
          Accept
        </button>
        <button
          onClick={() => declineMutation.mutate()}
          disabled={actionLoading}
          className="flex-1 bg-blue text-white py-3 rounded-xl font-medium disabled:opacity-50"
        >
          Decline
        </button>
      </>
    );
  } else if (sentInterest) {
    primaryAction = (
      <button
        disabled
        className="flex-1 bg-gray-200 text-gray-500 py-3 rounded-xl font-medium cursor-not-allowed"
      >
        Interest Sent
      </button>
    );
  } else {
    primaryAction = (
      <button
        onClick={() => sendInterestMutation.mutate()}
        disabled={actionLoading}
        className="flex-1 bg-peach text-white py-3 rounded-xl font-medium disabled:opacity-50"
      >
        Interested
      </button>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-24 md:pb-10">
      {/* Back */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <button onClick={() => router.back()} className="text-peach hover:text-peach/80">
          ← Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Photo area */}
        <div className="relative h-72 bg-peach-light rounded-3xl overflow-hidden shadow-card">
          {profile.primary_photo ? (
            <img src={profile.primary_photo} alt={profile.full_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/50">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          {profile.primary_photo && (
            <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Private
            </div>
          )}
        </div>

        {/* Main info */}
        <div className="mt-6 bg-white rounded-3xl shadow-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink">{profile.full_name}</h1>
              <p className="text-muted mt-1">{profile.location_city}, {profile.location_state}, {profile.location_country}</p>
            </div>
            <span className="text-lg font-semibold text-blue">{age} yrs</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {profile.verification_badges.map((badge) => (
              <span key={badge} className="bg-blue text-white px-3 py-1 rounded-full text-xs font-medium">
                {badge.replace('_', ' ')}
              </span>
            ))}
            <span className="bg-peach text-white px-3 py-1 rounded-full text-xs font-medium">
              {profile.diet.replace('_', ' ')}
            </span>
          </div>

          {/* About */}
          {profile.about_me && (
            <div className="mt-6">
              <h2 className="font-semibold text-ink mb-2">About</h2>
              <p className="text-ink/70">{profile.about_me}</p>
            </div>
          )}

          {/* Compatibility */}
          <div className="mt-6 bg-peach-light/30 rounded-2xl p-4">
            <h3 className="font-medium text-ink mb-2">Why you may connect</h3>
            {compatibility.reasons.length > 0 ? (
              <ul className="space-y-1 text-sm text-ink/80">
                {compatibility.reasons.slice(0,4).map((reason) => (
                  <li key={reason} className="flex items-center gap-2">
                    <span className="text-peach">✓</span> {reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No compatibility highlights yet.</p>
            )}
          </div>

          {/* Details grid */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted">Education</p>
              <p className="font-medium text-ink">{profile.education || '-'}</p>
            </div>
            <div>
              <p className="text-muted">Profession</p>
              <p className="font-medium text-ink">{profile.profession || '-'}</p>
            </div>
            <div>
              <p className="text-muted">Family involvement</p>
              <p className="font-medium text-ink">{profile.family_involvement}</p>
            </div>
            <div>
              <p className="text-muted">Relocation</p>
              <p className="font-medium text-ink">{profile.relocation_willingness}</p>
            </div>
            <div>
              <p className="text-muted">Tamil language</p>
              <p className="font-medium text-ink">{profile.tamil_language_importance}</p>
            </div>
            <div>
              <p className="text-muted">Spiritual</p>
              <p className="font-medium text-ink">{profile.spiritual_orientation}</p>
            </div>
          </div>
        </div>

        {/* Action buttons (sticky on mobile) */}
        <div className="fixed bottom-0 left-0 right-0 md:static mt-6 bg-white border-t md:border-0 p-4 md:p-0 z-50 flex gap-2 md:gap-4 md:flex-row flex-col md:flex-row">
          <div className="flex gap-2 md:gap-4 flex-1 md:flex-row flex-col">
            {primaryAction}
            <button
              onClick={() => requestPhotoMutation.mutate()}
              disabled={actionLoading}
              className="flex-1 bg-white border border-peach text-peach py-3 rounded-xl font-medium disabled:opacity-50"
            >
              Request Photo
            </button>
          </div>
          <button
            onClick={() => {
              // shortlist mutation handled inline
            }}
            className="w-full md:w-12 h-12 flex items-center justify-center rounded-xl border border-peach text-peach hover:bg-peach-light/30 transition"
            title="Shortlist"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}