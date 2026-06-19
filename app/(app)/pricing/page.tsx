"use client";

import { useAuth } from '@/app/_lib/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { paymentApi } from '@/app/_lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

function PricingContent() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'checking' | 'verified' | 'failed' | null>(null);

  useEffect(() => {
    const txnId = searchParams.get('transaction_id');
    if (!txnId || !token) return;

    setVerifyStatus('checking');
    const verify = async () => {
      try {
        await paymentApi.verifyTransaction(token, txnId);
        setVerifyStatus('verified');
        const params = new URLSearchParams(searchParams);
        params.delete('transaction_id');
        params.delete('checkout');
        router.replace(`/pricing?${params.toString()}`);
        setTimeout(() => setVerifyStatus(null), 2000);
      } catch {
        setVerifyStatus('failed');
      }
    };
    verify();
  }, [searchParams, token, router]);

  const handleUpgrade = (tier: 'pro' | 'collector') => {
    if (!token) {
      router.push('/login');
      return;
    }

    setProcessing(true);
    const priceId = tier === 'pro'
      ? process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO
      : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_COLLECTOR;

    if (!priceId) {
      alert('Price ID not configured');
      setProcessing(false);
      return;
    }

    const paddle = (window as any).Paddle;
    if (!paddle) {
      alert('Payment system not loaded');
      setProcessing(false);
      return;
    }

    paddle.Checkout.open({
      items: [{ priceId }],
      customer: { email: user?.email },
      settings: {
        displayMode: 'overlay',
      },
    });

    const originalClose = paddle.Checkout.close;
    paddle.Checkout.close = function() {
      setProcessing(false);
      originalClose.apply(this, arguments);
    };
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      const paddle = (window as any).Paddle;
      paddle.Environment.set('sandbox');
      paddle.Initialize({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        eventCallback: (event: any) => {
          if (event.type === 'checkout.completed') {
            const txnId = event.data.transaction_id;
            window.location.href = `/pricing?checkout=success&transaction_id=${txnId}`;
          }
        },
      });
    };
    document.body.appendChild(script);
  }, []);

  if (authLoading) return <div>Loading...</div>;

  const tiers = [
    {
      name: 'Free',
      price: 'Free',
      description: 'Get started with your plant journey',
      features: [
        '2 plant profiles',
        'Unlimited chat',
        'Last 10 messages per plant',
        '3 photo uploads/month',
        'Basic advice (GPT-4o-mini)',
      ],
      current: user?.tier === 'free',
      action: user?.tier === 'free' ? 'Current Plan' : 'Downgrade',
      tier: 'free' as const,
    },
    {
      name: 'Pro',
      price: '$7.99',
      period: '/month',
      description: 'For the serious plant parent',
      features: [
        'Unlimited plant profiles',
        'Full persistent chat history',
        'Unlimited photo uploads',
        'Weekly AI care plans',
        'Priority advice (GPT-4o)',
        'Exportable care logs',
      ],
      current: user?.tier === 'pro',
      action: 'Upgrade',
      tier: 'pro' as const,
    },
    {
      name: 'Collector',
      price: '$14.99',
      period: '/month',
      description: 'For collectors and enthusiasts',
      features: [
        'Everything in Pro',
        'Advanced disease diagnostics',
        'Propagation tracking',
        'Species compatibility notes',
        'Up to 5 household zones',
        'Early access to features',
      ],
      current: user?.tier === 'collector',
      action: 'Upgrade',
      tier: 'collector' as const,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Simple, Transparent Pricing</h1>
      <p className="text-center text-gray-600 mb-12">Choose the plan that fits your plant parenting style</p>

      {verifyStatus === 'verified' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 text-center">
          Payment verified! Your subscription is active.
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card
            key={tier.tier}
            className={`border-2 transition ${
              tier.current
                ? 'border-blue-500 shadow-lg'
                : 'border-gray-200 hover:shadow-lg'
            }`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-gray-900">{tier.name}</CardTitle>
                {tier.current && <Badge>Current</Badge>}
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">
                  {tier.price}
                  {tier.period && <span className="text-lg text-gray-600">{tier.period}</span>}
                </p>
                <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-gray-700">
                    <Check size={18} className="text-green-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              {tier.tier !== 'free' && (
                <Button
                  onClick={() => handleUpgrade(tier.tier)}
                  disabled={tier.current || processing || authLoading}
                  className="w-full"
                >
                  {tier.current ? 'Current Plan' : processing ? 'Processing...' : 'Upgrade Now'}
                </Button>
              )}
              {tier.tier === 'free' && (
                <Button
                  variant="outline"
                  disabled={tier.current}
                  className="w-full border-gray-300 text-gray-700"
                >
                  {tier.current ? 'Current Plan' : 'Get Started'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div>Loading pricing...</div>}>
      <PricingContent />
    </Suspense>
  );
}
