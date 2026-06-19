"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { plantApi } from '@/app/_lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewPlantPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nickname: '',
    species: '',
    pot_size: '',
    soil_type: 'potting mix',
    window_direction: 'E' as 'N' | 'S' | 'E' | 'W',
    zip_code: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError('');
    setLoading(true);

    try {
      const newPlant = await plantApi.create(token, formData);
      router.push(`/plants/${newPlant.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create plant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Your Plant</h1>
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
            <div>
              <Label htmlFor="nickname" className="text-gray-900">Plant Nickname *</Label>
              <Input
                id="nickname"
                placeholder="e.g., My Monstera"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                className="border-gray-300 text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="species" className="text-gray-900">Species (Optional)</Label>
              <Input
                id="species"
                placeholder="e.g., Monstera deliciosa"
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="border-gray-300 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <div>
              <Label htmlFor="potSize" className="text-gray-900">Pot Size *</Label>
              <Input
                id="potSize"
                placeholder="e.g., 6 inch"
                value={formData.pot_size}
                onChange={(e) => setFormData({ ...formData, pot_size: e.target.value })}
                className="border-gray-300 text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="soilType" className="text-gray-900">Soil Type *</Label>
              <Select value={formData.soil_type} onValueChange={(val) => setFormData({ ...formData, soil_type: val })}>
                <SelectTrigger className="border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="potting mix">Potting Mix</SelectItem>
                  <SelectItem value="orchid bark">Orchid Bark</SelectItem>
                  <SelectItem value="cactus mix">Cactus Mix</SelectItem>
                  <SelectItem value="peat moss">Peat Moss</SelectItem>
                  <SelectItem value="coconut coir">Coconut Coir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="window" className="text-gray-900">Window Direction *</Label>
              <Select value={formData.window_direction} onValueChange={(val) => setFormData({ ...formData, window_direction: val as 'N' | 'S' | 'E' | 'W' })}>
                <SelectTrigger className="border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N">North</SelectItem>
                  <SelectItem value="S">South</SelectItem>
                  <SelectItem value="E">East</SelectItem>
                  <SelectItem value="W">West</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="zipCode" className="text-gray-900">ZIP Code *</Label>
              <Input
                id="zipCode"
                placeholder="10001"
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                className="border-gray-300 text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Plant'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
