'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {useAuth} from '@/_lib/hooks';
import {paymentsApi} from '@/_lib/api';
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Check} from 'lucide-react';

declare global {
  interface Window {
    Paddle?: any;
  }
}

export default function PricingPage() {
  const {user, refresh} = useAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Environment.set(process.env.NEXT_PUBLIC_PADDLE_SANDBOX === 'true' ? 'sandbox' : 'production');
        window.Paddle.Initialize({token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN});
      }
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const txnId = searchParams.get('transaction_id');
    const checkout = searchParams.get('checkout');
    if (txnId && checkout === 'success') {
      verifyTransaction(txnId);
    }
  }, [searchParams]);

  const verifyTransaction = async (txnId: string) => {
    setVerifying(true);
    try {
      const result = await paymentsApi.verifyTransaction(txnId);
      setMessage(`Payment verified! Your ${result.tier} plan is now active.`);
      await refresh();
      window.history.replaceState({}, '', '/pricing');
    } catch (err) {
      setMessage('Payment processing... please wait.');
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        if (attempts > 20) {
          clearInterval(poll);
          setVerifying(false);
          return;
        }
        try {
          await refresh();
          clearInterval(poll);
          setVerifying(false);
        } catch {}
      }, 2000);
    } finally {
      setVerifying(false);
    }
  };

  const openCheckout = (priceId: string | null) => {
    if (!priceId) {
      alert('Price not configured');
      return;
    }
    if (!user) {
      alert('Please sign in first');
      return;
    }
    if (!window.Paddle) {
      alert('Paddle is loading. Please try again.');
      return;
    }

    window.Paddle.Checkout.open({
      items: [{priceId}],
      customer: {email: user.email},
      settings: {
        displayMode: 'overlay',
        theme: 'light',
      },
    });

    const cleanup = window.Paddle.onCheckoutComplete(async (data: any) => {
      const txnId = data?.data?.transaction_id;
      if (txnId) {
        window.Paddle.Checkout.close();
        window.location.href = `/pricing?checkout=success&transaction_id=${txnId}`;
      }
      cleanup();
    });
  };

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Get started with early access',
      features: ['Waitlist access', 'Email updates', 'Community access'],
      priceId: null,
      current: user?.tier === 'free',
    },
    {
      name: 'Grower',
      price: '$12',
      period: '/month',
      description: 'Track up to 10 plants',
      features: ['Up to 10 plants', 'Basic tracking', 'Care reminders', 'Standard support'],
      priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_GROWER ?? null,
      current: user?.tier === 'grower',
    },
    {
      name: 'Botanist',
      price: '$29',
      period: '/month',
      description: 'Unlimited plants with AI insights',
      features: ['Unlimited plants', 'AI care insights', 'Priority support', 'Advanced analytics'],
      priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_BOTANIST ?? null,
      current: user?.tier === 'botanist',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Simple, Transparent Pricing</h1>
        <p className="text-gray-600">Choose the plan that fits your plant care needs</p>
      </div>

      {message && (
        <Alert className="mb-6">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card key={tier.name} className={tier.current ? 'ring-2 ring-green-500' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle>{tier.name}</CardTitle>
                {tier.current && <Badge>Current</Badge>}
              </div>
              <CardDescription>
                <span className="text-2xl font-bold text-gray-900">{tier.price}</span>
                <span className="text-gray-600">{tier.period}</span>
              </CardDescription>
              <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => openCheckout(tier.priceId)}
                disabled={tier.current || loading || verifying}
                variant={tier.current ? 'outline' : 'default'}
                className="w-full"
              >
                {tier.current ? 'Current Plan' : `Upgrade to ${tier.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
