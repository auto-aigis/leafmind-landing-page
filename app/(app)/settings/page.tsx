'use client';

import {useAuth} from '@/_lib/hooks';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';

export default function SettingsPage() {
  const {user} = useAuth();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold text-gray-900">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-semibold text-gray-900">{user?.display_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Subscription</p>
            <Badge className="mt-1">{user?.tier}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
