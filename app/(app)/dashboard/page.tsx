"use client";

import { useAuth } from '@/app/_lib/hooks';
import { useEffect, useState } from 'react';
import { plantApi } from '@/app/_lib/api';
import * as types from '@/app/_lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const { user, token, loading } = useAuth();
  const [plants, setPlants] = useState<types.Plant[]>([]);
  const [plantLoading, setPlantLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || loading) return;

    const loadPlants = async () => {
      try {
        const data = await plantApi.list(token);
        setPlants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plants');
      } finally {
        setPlantLoading(false);
      }
    };

    loadPlants();
  }, [token, loading]);

  if (loading || plantLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.display_name}!</h1>
          <p className="text-gray-600 mt-2">Manage your plant collection and get personalized care advice</p>
        </div>
        <Link href="/plants/new">
          <Button className="flex items-center gap-2">
            <Plus size={20} /> Add Plant
          </Button>
        </Link>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 p-4 rounded mb-6">{error}</div>}

      {plants.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="pt-12 text-center">
            <p className="text-gray-600 mb-4">No plants yet. Add your first plant to get started!</p>
            <Link href="/plants/new">
              <Button>Add Your First Plant</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <Link key={plant.id} href={`/plants/${plant.id}`}>
              <Card className="border-gray-200 hover:shadow-lg transition cursor-pointer h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-gray-900">{plant.nickname}</CardTitle>
                      {plant.species && <p className="text-sm text-gray-600 mt-1">{plant.species}</p>}
                    </div>
                    <Badge variant={plant.health_status === 'healthy' ? 'default' : plant.health_status === 'needs_attention' ? 'destructive' : 'secondary'}>
                      {plant.health_status === 'healthy' ? '🌱' : plant.health_status === 'needs_attention' ? '⚠️' : '❓'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {plant.photo_url && <img src={plant.photo_url} alt={plant.nickname} className="w-full h-40 object-cover rounded mb-4" />}
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-semibold">Pot:</span> {plant.pot_size}</p>
                    <p><span className="font-semibold">Soil:</span> {plant.soil_type}</p>
                    <p><span className="font-semibold">Light:</span> Window {plant.window_direction}</p>
                    {plant.last_chat_at && <p className="text-xs text-gray-500 mt-2">Last chat: {new Date(plant.last_chat_at).toLocaleDateString()}</p>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
