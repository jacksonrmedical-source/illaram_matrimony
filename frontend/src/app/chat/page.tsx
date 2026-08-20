'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';
import { IndividualProfile } from '@/types';

interface ParticipantDetail {
  id: string;
  full_name: string;
}

interface LastMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  text: string;
  created_at: string;
}

interface Conversation {
  id: string;
  participants_details: ParticipantDetail[];
  last_message: LastMessage | null;
  unread_count: number;
  updated_at: string;
}

interface Message {
  id: string;
  conversation: string;
  sender_id: string;
  sender_name: string;
  text: string;
  is_read: boolean;
  created_at: string;
}

export default function ChatPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: myProfile } = useQuery<IndividualProfile>({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const response = await api.get('/profiles/individual-profiles/me/');
      return response.data;
    },
  });

  const { data: conversationsData, isLoading: convLoading } = useQuery<{ results: Conversation[] }>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await api.get('/chat/conversations/');
      return response.data;
    },
  });

  const { data: messagesData, isLoading: msgLoading } = useQuery<Message[]>({
    queryKey: ['messages', selectedConversationId],
    queryFn: async () => {
      if (!selectedConversationId) return [];
      const response = await api.get(`/chat/conversations/${selectedConversationId}/messages/`);
      return response.data;
    },
    enabled: !!selectedConversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, text }: { conversationId: string; text: string }) => {
      await api.post(`/chat/conversations/${conversationId}/send_message/`, { text });
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const convIdParam = searchParams.get('conversation_id');
    if (convIdParam) {
      setSelectedConversationId(convIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesData]);

  const handleSend = () => {
    if (!selectedConversationId || !newMessage.trim()) return;
    sendMessageMutation.mutate({ conversationId: selectedConversationId, text: newMessage });
  };

  const getOtherParticipantName = (conv: Conversation) => {
    if (!myProfile) return '';
    const other = conv.participants_details.find(p => p.id !== myProfile.id);
    return other?.full_name || 'Unknown';
  };

  if (convLoading) return <div className="p-8">Loading conversations...</div>;

  return (
    <AuthGuard>
      <div className="flex h-screen max-w-6xl mx-auto">
        <div className="w-1/3 border-r bg-white overflow-y-auto">
          <h2 className="p-4 text-xl font-bold border-b">Chats</h2>
          {conversationsData?.results?.length === 0 ? (
            <p className="p-4 text-gray-500">No conversations yet.</p>
          ) : (
            conversationsData?.results?.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`w-full text-left p-4 border-b hover:bg-gray-50 ${
                  selectedConversationId === conv.id ? 'bg-teal-50' : ''
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{getOtherParticipantName(conv)}</span>
                  {conv.unread_count > 0 && (
                    <span className="bg-teal-600 text-white text-xs rounded-full px-2 py-1">{conv.unread_count}</span>
                  )}
                </div>
                {conv.last_message && (
                  <p className="text-sm text-gray-500 truncate">
                    {conv.last_message.sender_name}: {conv.last_message.text}
                  </p>
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex-1 flex flex-col">
          {!selectedConversationId ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation to start chatting
            </div>
          ) : (
            <>
              <div className="p-4 border-b bg-white font-semibold">
                {getOtherParticipantName(conversationsData?.results?.find(c => c.id === selectedConversationId)!)}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {msgLoading ? (
                  <p>Loading messages...</p>
                ) : messagesData?.length === 0 ? (
                  <p className="text-gray-400">No messages yet. Say hello!</p>
                ) : (
                  messagesData?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === myProfile?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender_id === myProfile?.id
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-xs font-semibold">{msg.sender_name}</p>
                        <p>{msg.text}</p>
                        <p className="text-xs opacity-70">{new Date(msg.created_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t bg-white flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={handleSend}
                  disabled={sendMessageMutation.isPending || !newMessage.trim()}
                  className="bg-teal-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}