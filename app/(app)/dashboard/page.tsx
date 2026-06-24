"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function DashboardContent() {
  const searchParams = useSearchParams();
  const checkoutSuccess = searchParams.get("checkout") === "success";
  const [isProcessing, setIsProcessing] = useState(checkoutSuccess);

  useEffect(() => {
    if (checkoutSuccess && isProcessing) {
      const timer = setTimeout(() => setIsProcessing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [checkoutSuccess, isProcessing]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      {isProcessing && checkoutSuccess && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-green-800">Payment processing... please wait</p>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to LeafMind</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Start exploring LeafMind features.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Plan Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>Free Plan</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}