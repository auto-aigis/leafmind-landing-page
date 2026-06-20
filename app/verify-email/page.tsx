"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/app/_lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "waiting">("waiting");
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    if (token) {
      setStatus("loading");
      authApi
        .verifyEmail(token)
        .then(() => {
          setStatus("success");
          setTimeout(() => router.push("/dashboard"), 2000);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Verification failed");
          setStatus("error");
        });
    }
  }, [token, router]);

  const handleResendVerification = async () => {
    if (!email) return;
    setResendLoading(true);
    try {
      await authApi.resendVerification(email);
      setResendSent(true);
      setTimeout(() => setResendSent(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
      <Card className="w-full max-w-md border-gray-200">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            {status === "loading"
              ? "Verifying..."
              : status === "success"
                ? "Email verified!"
                : "Check your inbox"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Email verified successfully! Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {status === "waiting" && (
            <>
              {resendSent && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    Verification email sent!
                  </AlertDescription>
                </Alert>
              )}
              <p className="text-gray-700 text-sm">
                We've sent a verification link to <strong>{email}</strong>. Click the link in the email to verify your account.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendVerification}
                disabled={resendLoading}
              >
                {resendLoading ? "Sending..." : "Resend Verification Email"}
              </Button>
              <Link href="/login" className="block text-center text-green-600 hover:underline text-sm font-medium">
                Back to Sign In
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
