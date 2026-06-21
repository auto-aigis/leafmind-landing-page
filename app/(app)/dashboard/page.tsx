'use client';

import { useAuth } from '@/app/_lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user, subscription } = useAuth();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.display_name || user?.email}!</h1>
      <p className="text-gray-600 mb-8">Your LeafMind dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription tier</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 capitalize">{subscription?.tier || 'free'}</p>
            <p className="text-sm text-gray-600 mt-2">
              {subscription?.status === 'active' ? 'Active' : 'Inactive'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mindfulness Sessions</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-600 mt-2">Start your first session today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wellness Score</CardTitle>
            <CardDescription>Your health index</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">--</p>
            <p className="text-sm text-gray-600 mt-2">Complete sessions to build history</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">LeafMind is your personal AI wellness companion. Here's what you can do:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Complete daily mindfulness sessions</li>
            <li>Track your emotional wellness over time</li>
            <li>Get personalized recommendations</li>
            <li>Access community resources</li>
          </ul>
          <div className="pt-4">
            <Button className="bg-green-600 hover:bg-green-700">Start First Session</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}