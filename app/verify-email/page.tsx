"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [loading, setLoading] = useState(token ? true : false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [resendSent, setResendSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
          credentials: 'include',
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Verification failed');
        }

        const { token: authToken } = await res.json();
        localStorage.setItem('supabase_token', authToken);
        setStatus('success');
        setTimeout(() => router.push('/dashboard'), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed');
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Resend failed');
      setResendSent(true);
      setTimeout(() => setResendSent(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resend failed');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-4">
        <Card className="w-full max-w-md border-gray-200">
          <CardContent className="pt-8 text-center">
            <div className="text-green-600 text-lg font-semibold mb-2">Email verified!</div>
            <p className="text-gray-600">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error' && token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-4">
        <Card className="w-full max-w-md border-gray-200">
          <CardContent className="pt-8 text-center space-y-4">
            <div className="text-red-600 text-lg font-semibold">{error || 'Verification failed'}</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/login')} className="flex-1">
                Sign In
              </Button>
              <Button onClick={handleResend} disabled={loading} className="flex-1">
                Resend Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <Card className="w-full max-w-md border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 text-center">Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {token && loading && <div className="text-center text-gray-600">Verifying...</div>}
          {!token && email && (
            <>
              <p className="text-center text-gray-700">Check your inbox — we sent a verification link to <span className="font-semibold">{email}</span></p>
              <Button onClick={handleResend} disabled={loading} className="w-full">
                {resendSent ? 'Email sent!' : 'Resend verification email'}
              </Button>
              <div className="text-center">
                <Link href="/login" className="text-blue-600 hover:underline text-sm">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-white">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
