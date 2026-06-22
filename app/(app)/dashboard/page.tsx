"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { plantApi, authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import type { Plant, Subscription } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Leaf, MessageCircle } from "lucide-react";

function PlantCard({ plant }: { plant: Plant }) {
  return (
    <Link href={`/plants/${plant.id}`}>
      <Card className="border-gray-200 hover:shadow-md hover:border-green-200 transition-all cursor-pointer h-full">
        <div className="w-full h-44 bg-gradient-to-br from-green-50 to-emerald-100 rounded-t-lg overflow-hidden flex items-center justify-center">
          {plant.photo_url ? (
            <img src={plant.photo_url} alt={plant.nickname} className="w-full h-full object-cover" />
          ) : (
            <Leaf className="h-12 w-12 text-green-300" />
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">{plant.nickname}</h3>
          {plant.species && <p className="text-sm text-gray-500 truncate mt-0.5">{plant.species}</p>}
          <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
            <MessageCircle className="h-3 w-3" />
            {plant.last_chat_at
              ? `Last chat: ${new Date(plant.last_chat_at).toLocaleDateString()}`
              : "No chats yet"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

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

  const isPro = subscription?.plan === "pro";
  const atFreeLimit = !isPro && plants.length >= 2;

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading your plants...</div>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{user?.first_name ? `, ${user.first_name}` : ""}! 🌿
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {plants.length === 0 ? "Add your first plant to get started" : `${plants.length} plant${plants.length === 1 ? "" : "s"} in your collection`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isPro && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Pro ✓</span>
          )}
          {atFreeLimit ? (
            <Link href="/pricing">
              <Button className="bg-green-600 hover:bg-green-700" size="sm">
                Upgrade to Add More
              </Button>
            </Link>
          ) : (
            <Link href="/plants/new">
              <Button className="bg-green-600 hover:bg-green-700" size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add Plant
              </Button>
            </Link>
          )}
        </div>
      </div>

      {plants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Leaf className="h-10 w-10 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No plants yet</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm">
            Create your first plant profile and start getting personalized AI care advice
          </p>
          <Link href="/plants/new">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" /> Add Your First Plant
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plants.map((plant) => <PlantCard key={plant.id} plant={plant} />)}
          </div>

          {atFreeLimit && (
            <Card className="mt-6 border-yellow-200 bg-yellow-50">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-yellow-900 text-sm">Free tier limit reached</p>
                  <p className="text-yellow-700 text-xs mt-0.5">Upgrade to Pro for unlimited plants + GPT-4o responses</p>
                </div>
                <Link href="/pricing">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 shrink-0">
                    Upgrade $5.99/mo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
