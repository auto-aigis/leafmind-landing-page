'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { apiCall } from '@/app/_lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface Plan {
  tier: string;
  name: string;
  price: number;
  billing_interval: string;
  description: string;
  features: string[];
  price_id: string | null;
}

function PricingContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutState, setCheckoutState] = useState<'idle' | 'loading' | 'processing'>('idle');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await apiCall<{ plans: Plan[] }>('/api/pricing/plans');
        setPlans(data.plans);
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const checkoutSuccess = searchParams.get('checkout') === 'success';
    const txnId = searchParams.get('transaction_id');

    if (checkoutSuccess && txnId) {
      setCheckoutState('processing');
      const verifyTxn = async () => {
        try {
          await apiCall('/api/payments/verify-transaction', {
            method: 'POST',
            body: JSON.stringify({ transaction_id: txnId }),
          });
          window.history.replaceState({}, '', '/pricing');
          setCheckoutState('idle');
        } catch (err) {
          console.error('Failed to verify transaction:', err);
          setCheckoutState('idle');
        }
      };

      verifyTxn();
    }
  }, [searchParams]);

  const handleCheckout = (plan: Plan) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!plan.price_id) return;

    setCheckoutState('loading');

    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      const Paddle = (window as any).Paddle;
      if (!Paddle) return;

      Paddle.Environment.set('sandbox');
      Paddle.Initialize({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '',
        pwCustomer: { email: user.email },
      });

      Paddle.Checkout.open({
        items: [{ priceId: plan.price_id }],
        settings: {
          variant: 'embedded',
          displayMode: 'overlay',
        },
        eventCallback: (data: any) => {
          if (data.type === 'checkout.completed') {
            const txnId = data.data.transaction_id;
            Paddle.Checkout.close();
            window.location.href = `/pricing?checkout=success&transaction_id=${txnId}`;
          }
        },
      });

      setCheckoutState('idle');
    };
    document.body.appendChild(script);
  };

  if (loading) {
    return <div className="text-center py-12">Loading pricing plans...</div>;
  }

  if (checkoutState === 'processing') {
    return <div className="text-center py-12 text-lg font-medium">Payment processing... please wait</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Simple, Transparent Pricing</h1>
      <p className="text-gray-600 mb-12">Choose the plan that's right for you</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.tier} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div>
                <p className="text-4xl font-bold text-gray-900">${plan.price}</p>
                <p className="text-sm text-gray-600">per {plan.billing_interval}</p>
              </div>

              <Button
                onClick={() => handleCheckout(plan)}
                disabled={checkoutState === 'loading'}
                className={plan.tier === 'pro' ? 'w-full bg-green-600 hover:bg-green-700' : 'w-full'}
              >
                {plan.tier === 'free' ? 'Current Plan' : checkoutState === 'loading' ? 'Loading...' : 'Subscribe'}
              </Button>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}