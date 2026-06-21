'use client';

import { useAuth } from '@/app/_lib/hooks';
import { apiCall } from '@/app/_lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Settings() {
  const { user, subscription } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = async () => {
    try {
      await apiCall('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-600 mb-8">Manage your account</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-medium text-gray-900">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Display Name</p>
            <p className="text-lg font-medium text-gray-900">{user?.display_name || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-lg font-medium text-gray-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '--'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Current Tier</p>
            <p className="text-lg font-medium text-gray-900 capitalize">{subscription?.tier || 'free'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-lg font-medium text-gray-900 capitalize">{subscription?.status || 'inactive'}</p>
          </div>
          {subscription?.current_period_end && (
            <div>
              <p className="text-sm text-gray-600">Renews</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            </div>
          )}
          <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
            Manage Subscription
          </Button>
        </CardContent>
      </Card>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-4">{error}</div>}
      {success && <div className="p-3 bg-green-50 text-green-700 rounded-lg mb-4">{success}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}