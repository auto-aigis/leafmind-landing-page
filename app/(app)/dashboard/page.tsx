"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { plantApi, authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import type { Plant, Subscription } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Leaf } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.onboarding_complete) {
      router.push("/onboarding");
      return;
    }

    Promise.all([
      plantApi.list().then(setPlants),
      authApi.getSubscription().then(setSubscription),
    ]).finally(() => setLoading(false));
  }, [user, router]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.first_name || "Plant Lover"}!</h1>
          <p className="text-gray-600 mt-1">Your plants are waiting for care advice</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Plan: <span className="font-medium text-gray-900">{subscription?.plan === "pro" ? "LeafMind Pro" : "Free"}</span></p>
        </div>
      </div>

      {plants.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="pt-12 pb-12 text-center">
            <Leaf className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No plants yet</h2>
            <p className="text-gray-600 mb-6">Start by adding your first plant profile</p>
            <Link href="/plants/new">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" /> Add Your First Plant
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plants.map((plant) => (
              <Link key={plant.id} href={`/plants/${plant.id}`}>
                <Card className="border-gray-200 hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    {plant.photo_url && (
                      <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={plant.photo_url}
                          alt={plant.nickname}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 mb-1">{plant.nickname}</h3>
                    {plant.species && (
                      <p className="text-sm text-gray-600 mb-3">{plant.species}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {plant.last_chat_at ? `Last chat: ${new Date(plant.last_chat_at).toLocaleDateString()}` : "No chats yet"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {(subscription?.plan === "free" && plants.length >= 2) ? (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6 text-center">
                <p className="text-yellow-900 font-medium mb-4">
                  You've reached the free tier limit of 2 plants
                </p>
                <Link href="/pricing">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Upgrade to Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Link href="/plants/new">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" /> Add Another Plant
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
