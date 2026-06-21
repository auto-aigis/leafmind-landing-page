'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PlantPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      // TODO: Implement plant deletion API call
      router.push('/plants');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Plant {id}</h1>
      <Button onClick={handleDelete} variant="destructive">
        Delete Plant
      </Button>
    </div>
  );
}
