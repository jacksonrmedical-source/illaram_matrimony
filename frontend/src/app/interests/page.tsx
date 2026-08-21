'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';
import { IndividualProfile } from '@/types';

interface Interest {
  id: string;
  sender: string;
  receiver: string;
  status: string;
  photo_request: boolean;
  created_at: string;
  sender_name?: string;
  receiver_name?: string;
}

export default function InterestsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [error, setError] = useState('');

  const { data: myProfile } = useQuery<IndividualProfile>({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const response = await api.get('/profiles/individual-profiles/me/');
      return response.data;
    },
  });

  const { data: interestsData, isLoading } = useQuery<{ results: Interest[] }>({
    queryKey: ['interests'],
    queryFn: async () => {
      const response = await api.get('/interests/interests/');
      return response.data;
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (interestId: string) => {
      await api.post(`/interests/interests/${interestId}/accept/`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interests'] }),
  });

  const declineMutation = useMutation({
    mutationFn: async (interestId: string) => {
      await api.post(`/interests/interests/${interestId}/decline/`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interests'] }),
  });

  const startConversationMutation = useMutation({
    mutationFn: async (participantId: string) => {
      const response = await api.post('/chat/conversations/', { participant_id: participantId });
      return response.data;
    },
    onSuccess: (data) => router.push(`/chat?conversation_id=${data.id}`),
    onError: (err: any) => setError(err.response?.data?.detail || 'Failed to start conversation'),
  });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  const myId = myProfile?.id;
  const interests = interestsData?.results || [];
  const received = interests.filter(i => i.receiver === myId);
  const sent = interests.filter(i => i.sender === myId);
  const displayed = tab === 'received' ? received : sent;
  const getOtherProfileId = (interest: Interest) => interest.sender === myId ? interest.receiver : interest.sender;

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-charcoal mb-6">Interests</h1>

        {/* Tabs */}
        <div className="flex gap-2 bg-white p-1 rounded-2xl shadow-card mb-6">
          <button
            onClick={() => setTab('received')}
            className={`flex-1 py-2.5 rounded-xl font-medium ${tab === 'received' ? 'bg-primary text-white' : 'text-muted'}`}
          >
            Received ({received.length})
          </button>
          <button
            onClick={() => setTab('sent')}
            className={`flex-1 py-2.5 rounded-xl font-medium ${tab === 'sent' ? 'bg-primary text-white' : 'text-muted'}`}
          >
            Sent ({sent.length})
          </button>
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <p className="text-xl">No interests yet.</p>
            <button onClick={() => router.push('/profiles')} className="mt-4 text-primary">Browse Profiles</button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((interest) => (
              <div key={interest.id} className="bg-white rounded-2xl shadow-card p-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-charcoal">
                      {tab === 'received' ? interest.sender_name || interest.sender : interest.receiver_name || interest.receiver}
                    </h3>
                    <p className="text-sm text-muted">
                      {interest.status}{interest.photo_request && ' · Photo requested'}
                    </p>
                    <p className="text-xs text-muted">{new Date(interest.created_at).toLocaleString()}</p>
                  </div>

                  <div className="flex gap-2">
                    {tab === 'received' && interest.status === 'sent' && (
                      <>
                        <button
                          onClick={() => acceptMutation.mutate(interest.id)}
                          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => declineMutation.mutate(interest.id)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {interest.status === 'accepted' && (
                      <button
                        onClick={() => startConversationMutation.mutate(getOtherProfileId(interest))}
                        className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-medium"
                      >
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </AuthGuard>
  );
}