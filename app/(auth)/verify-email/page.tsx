'use client';

import {Suspense, useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {authApi} from '@/_lib/api';
import {useAuth} from '@/_lib/hooks';
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Leaf} from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const params = useSearchParams();
  const {refresh} = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const token = params.get('token');
  const email = params.get('email');

  useEffect(() => {
    if (token) {
      const verify = async () => {
        setLoading(true);
        try {
          await authApi.verifyEmail(token);
          await refresh();
          setStatus('success');
          setTimeout(() => router.push('/dashboard'), 2000);
        } catch (err) {
          setStatus('error');
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
    setResending(true);
    try {
      await authApi.resendVerification(email);
      setResendSent(true);
      setTimeout(() => setResendSent(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  if (token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Leaf className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle>{status === 'success' ? 'Email Verified!' : status === 'error' ? 'Verification Failed' : 'Verifying...'}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div>Verifying your email...</div>}
          {status === 'success' && <Alert><AlertDescription>Email verified successfully! Redirecting...</AlertDescription></Alert>}
          {status === 'error' && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Leaf className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle>Check Your Email</CardTitle>
        <CardDescription>We sent a verification link to {email}</CardDescription>
      </CardHeader>
      <CardContent>
        {resendSent && <Alert><AlertDescription>Verification email sent!</AlertDescription></Alert>}
        <div className="text-center text-sm text-gray-600">
          Click the link in the email to verify your account and log in.
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button onClick={handleResend} variant="outline" className="w-full" disabled={resending}>
          {resending ? 'Sending...' : 'Resend Verification Email'}
        </Button>
        <Link href="/login" className="text-center text-sm text-green-600 hover:underline">
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Card className="w-full max-w-md"><CardContent className="pt-6">Loading...</CardContent></Card>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
