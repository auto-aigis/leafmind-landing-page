"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [cityZip, setCityZip] = useState("");
  const [plantCount, setPlantCount] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user?.onboarding_complete) {
    router.push("/dashboard");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.onboarding(firstName, cityZip, parseInt(plantCount) || 1);
      await refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onboarding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
      <Card className="w-full max-w-md border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to LeafMind</CardTitle>
          <CardDescription>Tell us a bit about yourself</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Your name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cityZip">City or Zip Code</Label>
              <Input
                id="cityZip"
                type="text"
                placeholder="e.g., San Francisco or 94102"
                value={cityZip}
                onChange={(e) => setCityZip(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plantCount">How many plants do you have?</Label>
              <Input
                id="plantCount"
                type="number"
                min="1"
                placeholder="1"
                value={plantCount}
                onChange={(e) => setPlantCount(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? "Saving..." : "Get Started"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
