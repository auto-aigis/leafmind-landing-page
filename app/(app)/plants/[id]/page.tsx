"use client";

import { useParams } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { useEffect, useState, useRef } from 'react';
import { plantApi, chatApi } from '@/app/_lib/api';
import * as types from '@/app/_lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Upload } from 'lucide-react';

export default function PlantChatPage() {
  const params = useParams();
  const { token, loading: authLoading } = useAuth();
  const plantId = params.id as string;
  const [plant, setPlant] = useState<types.Plant | null>(null);
  const [messages, setMessages] = useState<types.Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token || authLoading) return;
    const loadPlant = async () => {
      try {
        const p = await plantApi.get(token, plantId);
        setPlant(p);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plant');
      }
    };
    loadPlant();
  }, [token, plantId, authLoading]);

  useEffect(() => {
    if (!token || authLoading) return;
    const loadMessages = async () => {
      try {
        const msgs = await chatApi.getMessages(token, plantId);
        setMessages(msgs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, [token, plantId, authLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePhotoUpload = async (file: File) => {
    if (!token) return;
    try {
      const url = await plantApi.uploadPhoto(token, plantId, file);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Photo upload failed');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !messageText.trim()) return;
    setSending(true);
    setError('');

    try {
      const response = await chatApi.sendMessage(token, plantId, messageText, imageUrl || undefined);
      setMessages([...messages, response]);
      setMessageText('');
      setImageUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading || authLoading) return <div>Loading...</div>;
  if (!plant) return <div>Plant not found</div>;

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      <Card className="border-gray-200 mb-4">
        <CardHeader>
          <div className="flex items-start gap-4">
            {plant.photo_url && <img src={plant.photo_url} alt={plant.nickname} className="w-20 h-20 object-cover rounded" />}
            <div>
              <CardTitle className="text-gray-900">{plant.nickname}</CardTitle>
              {plant.species && <p className="text-sm text-gray-600">{plant.species}</p>}
              <p className="text-xs text-gray-500 mt-2">Window: {plant.window_direction} | Pot: {plant.pot_size} | Soil: {plant.soil_type}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start a conversation about your plant!</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-900'
            }`}>
              <p className="text-sm">{msg.content}</p>
              {msg.confidence_label && msg.role === 'assistant' && (
                <div className="text-xs mt-2 opacity-80">
                  <p>{msg.confidence_label}</p>
                  {msg.reasoning && <p className="italic mt-1">{msg.reasoning}</p>}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="space-y-3">
        {imageUrl && (
          <div className="relative w-20 h-20 bg-gray-100 rounded">
            <img src={imageUrl} alt="Upload preview" className="w-full h-full object-cover rounded" />
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-gray-300 text-gray-700"
          >
            <Upload size={18} />
          </Button>
          <Input
            type="text"
            placeholder="Ask about your plant..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 border-gray-300 text-gray-900 placeholder:text-gray-500"
          />
          <Button type="submit" disabled={sending || !messageText.trim()}>
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
}
