'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';
import { IndividualProfile } from '@/types';

interface ParticipantDetail { id: string; full_name: string; }
interface LastMessage { id: string; sender_id: string; sender_name: string; text: string; created_at: string; }
interface Conversation { id: string; participants_details: ParticipantDetail[]; last_message: LastMessage | null; unread_count: number; updated_at: string; }
interface Message { id: string; conversation: string; sender_id: string; sender_name: string; text: string; is_read: boolean; created_at: string; }

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

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const convIdParam = searchParams.get('conversation_id');
    if (convIdParam) setSelectedConversationId(convIdParam);
  }, [searchParams]);

  useEffect(() => { scrollToBottom(); }, [messagesData]);

  const handleSend = () => {
    if (!selectedConversationId || !newMessage.trim()) return;
    sendMessageMutation.mutate({ conversationId: selectedConversationId, text: newMessage });
  };

  const getOtherParticipantName = (conv: Conversation) => {
    if (!myProfile) return '';
    const other = conv.participants_details.find(p => p.id !== myProfile.id);
    return other?.full_name || 'Unknown';
  };

  if (convLoading) return <div className="p-8 text-center">Loading conversations...</div>;

  return (
    <AuthGuard>
      <div className="flex h-[calc(100vh-70px)] max-w-6xl mx-auto overflow-hidden">
        {/* Conversation list */}
        <div className="w-1/3 bg-white border-r border-gray-100 hidden md:flex flex-col">
          <h2 className="p-5 text-xl font-bold text-charcoal border-b">Messages</h2>
          <div className="flex-1 overflow-y-auto">
            {conversationsData?.results?.length === 0 ? (
              <p className="p-5 text-muted">No conversations yet.</p>
            ) : (
              conversationsData?.results?.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`w-full text-left p-4 border-b hover:bg-surface transition ${
                    selectedConversationId === conv.id ? 'bg-primary-soft' : ''
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-charcoal">{getOtherParticipantName(conv)}</span>
                    {conv.unread_count > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full px-2 py-1">{conv.unread_count}</span>
                    )}
                  </div>
                  {conv.last_message && (
                    <p className="text-sm text-muted truncate mt-1">
                      {conv.last_message.sender_name}: {conv.last_message.text}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message area */}
        <div className="flex-1 flex flex-col bg-surface">
          {!selectedConversationId ? (
            <div className="flex-1 flex items-center justify-center text-muted">
              Select a conversation
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 bg-white border-b flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary font-bold">
                  {getOtherParticipantName(conversationsData?.results?.find(c => c.id === selectedConversationId)!)?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">
                    {getOtherParticipantName(conversationsData?.results?.find(c => c.id === selectedConversationId)!)}
                  </h3>
                  <span className="text-xs text-green-600">● Online</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {msgLoading ? (
                  <p className="text-center text-muted">Loading messages...</p>
                ) : messagesData?.length === 0 ? (
                  <p className="text-center text-muted mt-10">No messages yet. Say hello!</p>
                ) : (
                  messagesData?.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_id === myProfile?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                        msg.sender_id === myProfile?.id ? 'bg-primary text-white' : 'bg-white text-charcoal'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs opacity-70 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSend}
                  className="bg-primary text-white px-5 py-3 rounded-xl hover:bg-primary-dark font-medium"
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