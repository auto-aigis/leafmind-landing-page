"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import type { Subscription } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const FEATURES_PRO = [
  "Unlimited plant profiles",
  "Full persistent chat memory",
  "GPT-4o powered responses",
  "Priority AI responses",
];

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const priceIdMonthly = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_MONTHLY;
  const priceIdAnnual = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_ANNUAL;
  const environment = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox") as string;

  useEffect(() => {
    authApi.getSubscription().then(setSubscription).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      window.history.replaceState({}, "", "/pricing");
      setTimeout(() => authApi.getSubscription().then(setSubscription), 2000);
    }
  }, [searchParams]);

  const handleCheckout = (priceId: string | undefined) => {
    if (!priceId) { alert("Pricing not configured yet — check back soon!"); return; }
    if (!user) { router.push("/login"); return; }
    if (!clientToken) { alert("Paddle client token not configured."); return; }

    setCheckoutLoading(true);

    const existing = document.getElementById("paddle-script");
    if (existing) {
      openPaddleCheckout(priceId);
      return;
    }

    const script = document.createElement("script");
    script.id = "paddle-script";
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    document.head.appendChild(script);

    script.onload = () => openPaddleCheckout(priceId);
    script.onerror = () => {
      alert("Failed to load Paddle checkout");
      setCheckoutLoading(false);
    };
  };

  const openPaddleCheckout = (priceId: string) => {
    const paddle = (window as any).Paddle;
    if (!paddle) { setCheckoutLoading(false); return; }

    paddle.Environment.set(environment);
    paddle.Initialize({
      token: clientToken,
      eventCallback: (event: any) => {
        if (event.name === "checkout.completed") {
          paddle.Checkout.close();
          setCheckoutLoading(false);
          router.push("/pricing?checkout=success");
        }
      },
    });

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { user_id: user?.id },
      customer: user?.email ? { email: user.email } : undefined,
    });
    setCheckoutLoading(false);
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  const isPro = subscription?.plan === "pro";

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Simple, Transparent Pricing</h1>
        <p className="text-gray-500">Start free. Upgrade when your plant collection grows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-3xl font-bold text-gray-900">$0</p>
              <p className="text-gray-500 text-sm">Forever free</p>
            </div>
            <ul className="space-y-2 text-sm">
              {["Up to 2 plant profiles", "AI care chat", "Basic responses"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-600">{f}</span>
                </li>
              ))}
            </ul>
            {!isPro && <Badge className="bg-green-100 text-green-800 border-green-200">Your Plan</Badge>}
          </CardContent>
        </Card>

        {/* Pro Monthly */}
        <Card className="border-green-400 ring-2 ring-green-100 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-0.5 rounded-full text-xs font-semibold">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle>Pro Monthly</CardTitle>
            <CardDescription>For serious plant parents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-3xl font-bold text-gray-900">$5.99</p>
              <p className="text-gray-500 text-sm">per month</p>
            </div>
            <ul className="space-y-2 text-sm">
              {FEATURES_PRO.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-600">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => handleCheckout(priceIdMonthly)}
              disabled={checkoutLoading || isPro}
            >
              {isPro ? "Current Plan" : checkoutLoading ? "Loading..." : "Upgrade Now"}
            </Button>
          </CardContent>
        </Card>

        {/* Pro Annual */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Pro Annual</CardTitle>
            <CardDescription>
              <span className="text-green-600 font-semibold">Save ~33%</span> vs monthly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-3xl font-bold text-gray-900">$47.99</p>
              <p className="text-gray-500 text-sm">per year <span className="text-green-600 text-xs font-semibold">(= $4/mo)</span></p>
            </div>
            <ul className="space-y-2 text-sm">
              {FEATURES_PRO.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-600">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => handleCheckout(priceIdAnnual)}
              disabled={checkoutLoading || isPro}
            >
              {isPro ? "Current Plan" : checkoutLoading ? "Loading..." : "Upgrade & Save"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}
