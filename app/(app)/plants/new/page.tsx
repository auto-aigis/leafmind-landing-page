'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewPlantPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement plant creation API call
      router.push('/plants');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Plant</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <Input
          placeholder="Plant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? 'Creating...' : 'Create Plant'}
        </Button>
      </form>
    </div>
  );
}
