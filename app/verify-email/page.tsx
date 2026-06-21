'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { apiCall } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token) {
      const verify = async () => {
        setLoading(true);
        try {
          await apiCall('/api/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ token }),
          });

          await refresh();
          router.push('/dashboard');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Verification failed');
        } finally {
          setLoading(false);
        }
      };

      verify();
    }
  }, [token, router, refresh]);

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    try {
      await apiCall('/api/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setResendSent(true);
      setTimeout(() => setResendSent(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend');
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium text-gray-900">Verifying your email...</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>Check your inbox for the verification link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {email && (
            <p className="text-gray-700">
              We sent a verification link to <strong>{email}</strong>. Click the link in your email to verify your account.
            </p>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {email && (
            <>
              <Button
                onClick={handleResend}
                disabled={resendLoading}
                variant="outline"
                className="w-full"
              >
                {resendLoading ? 'Sending...' : resendSent ? 'Email sent!' : 'Resend verification email'}
              </Button>

              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}