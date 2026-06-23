'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {authApi} from '@/_lib/api';
import {useAuth} from '@/_lib/hooks';
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Leaf} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const {refresh} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [unverified, setUnverified] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUnverified(false);
    setLoading(true);

    try {
      await authApi.login(email, password);
      await refresh();
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error && err.message === 'email_not_verified') {
        setUnverified(true);
      } else {
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Leaf className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Access your plant care dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          {unverified && (
            <Alert>
              <AlertDescription>
                Please verify your email. Check your inbox for a verification link.
              </AlertDescription>
            </Alert>
          )}
          {resendSent && <Alert><AlertDescription>Verification email sent!</AlertDescription></Alert>}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            {unverified && (
              <Button type="button" variant="outline" className="w-full" onClick={handleResend} disabled={resending}>
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm text-gray-600">
        Don't have an account? <Link href="/register" className="text-green-600 hover:underline ml-1">Sign up</Link>
      </CardFooter>
    </Card>
  );
}
