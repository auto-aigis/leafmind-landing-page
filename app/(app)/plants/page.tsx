'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {plantsApi} from '@/_lib/api';
import {Plant} from '@/_lib/types';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await plantsApi.list();
        setPlants(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Plants</h1>
        <Link href="/plants/new"><Button>Add Plant</Button></Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div>Loading...</div>
          ) : plants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No plants yet.</div>
          ) : (
            <div className="grid gap-4">
              {plants.map((plant) => (
                <div key={plant.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <h3 className="font-semibold text-gray-900">{plant.name}</h3>
                  <p className="text-sm text-gray-600">{plant.species}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
