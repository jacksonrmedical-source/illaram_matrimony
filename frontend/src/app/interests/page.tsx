'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const [tab, setTab] = useState<'received' | 'sent'>('received');

  const { data: myProfile, isLoading: profileLoading } = useQuery<IndividualProfile>({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const response = await api.get('/profiles/individual-profiles/me/');
      return response.data;
    },
  });

  const { data: interestsData, isLoading: interestsLoading } = useQuery<{ results: Interest[] }>({
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: async (interestId: string) => {
      await api.post(`/interests/interests/${interestId}/decline/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
  });

  if (profileLoading || interestsLoading) return <div className="p-8">Loading...</div>;

  const myId = myProfile?.id;
  const interests = interestsData?.results || [];

  const received = interests.filter(i => i.receiver === myId);
  const sent = interests.filter(i => i.sender === myId);
  const displayed = tab === 'received' ? received : sent;

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Interests</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('received')}
            className={`px-4 py-2 rounded ${tab === 'received' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
          >
            Received ({received.length})
          </button>
          <button
            onClick={() => setTab('sent')}
            className={`px-4 py-2 rounded ${tab === 'sent' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
          >
            Sent ({sent.length})
          </button>
        </div>

        {displayed.length === 0 ? (
          <p className="text-gray-500">No interests yet.</p>
        ) : (
          <ul className="space-y-4">
            {displayed.map((interest) => (
              <li key={interest.id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      {tab === 'received'
                        ? interest.sender_name || interest.sender
                        : interest.receiver_name || interest.receiver}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {interest.status}
                      {interest.photo_request && ' · Photo requested'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(interest.created_at).toLocaleString()}
                    </p>
                  </div>
                  {tab === 'received' && interest.status === 'sent' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptMutation.mutate(interest.id)}
                        disabled={acceptMutation.isPending}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => declineMutation.mutate(interest.id)}
                        disabled={declineMutation.isPending}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AuthGuard>
  );
}