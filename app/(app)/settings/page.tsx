"use client";

import { useAuth } from '@/app/_lib/hooks';
import { useEffect, useState } from 'react';
import { authApi, settingsApi } from '@/app/_lib/api';
import * as types from '@/app/_lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, token, loading } = useAuth();
  const [subscription, setSubscription] = useState<types.Subscription | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token || loading) return;

    const loadData = async () => {
      try {
        const sub = await authApi.subscription(token);
        setSubscription(sub);
        const keyData = await settingsApi.getApiKey(token);
        if (keyData.has_key) setApiKey(`●●●●●●●●`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      }
    };

    loadData();
  }, [token, loading]);

  const handleSaveApiKey = async () => {
    if (!token || !newApiKey.trim()) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await settingsApi.setApiKey(token, newApiKey);
      setApiKey(`●●●●●●●●`);
      setNewApiKey('');
      setSuccess('API key saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

   const periodEnd = subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A';
   const tierDisplay = subscription?.tier ? subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1) : 'Unknown';


  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-gray-900 font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="text-gray-900 font-medium">{user?.display_name}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Current Plan</p>
            <p className="text-gray-900 font-medium">{tierDisplay} Tier</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-gray-900 font-medium capitalize">{subscription?.status}</p>
          </div>
          {subscription?.status === 'active' && (
            <div>
              <p className="text-sm text-gray-600">Next Billing Date</p>
              <p className="text-gray-900 font-medium">{periodEnd}</p>
            </div>
          )}
          {subscription?.tier !== 'free' && (
            <Button
              as={Link}
              href={process.env.NEXT_PUBLIC_PADDLE_PORTAL_URL || '#'}
              className="mt-4"
              target="_blank"
            >
              Manage Subscription
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">OpenAI API Key (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">Provide your own OpenAI API key to use your account credits instead of ours.</p>
          {apiKey && <p className="text-sm text-green-600">✓ API key configured</p>}
          <div>
            <Label htmlFor="apikey" className="text-gray-900">New API Key</Label>
            <Input
              id="apikey"
              type="password"
              placeholder="sk-..."
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              className="border-gray-300 text-gray-900 placeholder:text-gray-500"
            />
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
          {success && <div className="text-sm text-green-600 bg-green-50 p-3 rounded">{success}</div>}
          <div className="flex gap-2">
            <Button onClick={handleSaveApiKey} disabled={saving || !newApiKey.trim()}>
              {saving ? 'Saving...' : 'Save API Key'}
            </Button>
            {apiKey && (
              <Button
                variant="outline"
                onClick={async () => {
                  if (!token) return;
                  try {
                    await settingsApi.deleteApiKey(token);
                    setApiKey('');
                    setSuccess('API key removed');
                    setTimeout(() => setSuccess(''), 3000);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to remove key');
                  }
                }}
                className="border-gray-300 text-gray-700"
              >
                Remove Key
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
