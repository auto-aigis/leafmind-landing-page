"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import type { Subscription } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

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
  const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox";

  useEffect(() => {
    authApi.getSubscription().then(setSubscription).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const checkoutSuccess = searchParams.get("checkout");
    const transactionId = searchParams.get("transaction_id");

    if (checkoutSuccess === "success" && transactionId) {
      if (window.history.replaceState) {
        window.history.replaceState({}, "", "/pricing");
      }
      authApi.getSubscription().then(setSubscription);
    }
  }, [searchParams]);

  const handleCheckout = (priceId: string | undefined) => {
    if (!priceId) {
      alert("Price not configured");
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    setCheckoutLoading(true);

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    document.head.appendChild(script);

    script.onload = () => {
      const paddle = (window as any).Paddle;
      if (!paddle) {
        alert("Paddle failed to load");
        setCheckoutLoading(false);
        return;
      }

      paddle.Environment.set(environment);
      paddle.Initialize({
        token: clientToken,
        eventCallback: (event: any) => {
          if (event.name === "checkout.completed") {
            const txnId = event.data.transaction_id;
            paddle.Checkout.close();
            window.location.href = `/dashboard?checkout=success&transaction_id=${txnId}`;
          }
        },
      });

      paddle.Checkout.open({ items: [{ priceId }] });
      setCheckoutLoading(false);
    };

    script.onerror = () => {
      alert("Failed to load Paddle checkout");
      setCheckoutLoading(false);
    };
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Simple, Transparent Pricing</h1>
      <p className="text-gray-600 mb-8">Choose the plan that fits your plant collection</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200 relative">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>
              {subscription?.plan === "free" && <Badge className="mt-2">Your Plan</Badge>}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-3xl font-bold text-gray-900">$0</p>
              <p className="text-gray-600 text-sm">Forever</p>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "Up to 2 plant profiles",
                "Unlimited chat on your plants",
                "AI care advice",
              ].map((f) => (
                <li key={f} className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full"
              disabled={subscription?.plan === "free"}
            >
              {subscription?.plan === "free" ? "Current Plan" : "Downgrade"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-200 ring-2 ring-green-100 relative">
          <div className="absolute -top-3 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Popular
          </div>
          <CardHeader>
            <CardTitle>Pro (Monthly)</CardTitle>
            <CardDescription>
              Best for plant enthusiasts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-3xl font-bold text-gray-900">$5.99</p>
              <p className="text-gray-600 text-sm">per month</p>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "Unlimited plant profiles",
                "Full chat history",
                "Priority AI responses",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => handleCheckout(priceIdMonthly)}
              disabled={checkoutLoading || subscription?.plan === "pro"}
            >
              {checkoutLoading
                ? "Loading..."
                : subscription?.plan === "pro"
                  ? "Current Plan"
                  : "Upgrade Now"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200 relative">
          <CardHeader>
            <CardTitle>Pro (Annual)</CardTitle>
            <CardDescription>
              Save 33% annually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-3xl font-bold text-gray-900">$47.99</p>
              <p className="text-gray-600 text-sm">per year</p>
              <p className="text-xs text-green-600 font-semibold mt-1">Save $23.89</p>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "Unlimited plant profiles",
                "Full chat history",
                "Priority AI responses",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => handleCheckout(priceIdAnnual)}
              disabled={checkoutLoading || subscription?.plan === "pro"}
            >
              {checkoutLoading
                ? "Loading..."
                : subscription?.plan === "pro"
                  ? "Current Plan"
                  : "Upgrade Now"}
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
