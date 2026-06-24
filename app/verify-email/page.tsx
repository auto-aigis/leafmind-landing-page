"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const router = useRouter();
  const { refresh } = useAuth();

  useEffect(() => {
    if (token) {
      (async () => {
        try {
          await authApi.resendVerification(token);
          await refresh();
          setSuccess(true);
          setTimeout(() => router.push("/dashboard"), 2000);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Verification failed");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [token, refresh, router]);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await authApi.resendVerification(email);
      setResendSent(true);
      setTimeout(() => setResendSent(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-4">
        <Card className="w-full max-w-md border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-green-800 font-medium">Email verified! Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert className="bg-red-50 border-red-200"><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>}
          {token ? (
            loading && <p className="text-gray-600">Verifying...</p>
          ) : email ? (
            <>
              <p className="text-gray-600">
                We sent a verification link to <strong>{email}</strong>. Check your inbox.
              </p>
              {resendSent && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">Email sent! Check your inbox.</AlertDescription>
                </Alert>
              )}
              <Button onClick={handleResend} disabled={loading} className="w-full">
                Resend Verification Email
              </Button>
              <Link href="/login" className="block text-center text-blue-600 hover:underline">
                Back to Sign In
              </Link>
            </>
          ) : (
            <p className="text-gray-600">Invalid verification link.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-white">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}