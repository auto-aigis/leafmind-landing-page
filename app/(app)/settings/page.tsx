"use client";

import { useEffect, useState } from "react";
import { settingsApi, authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import type { ApiKey } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [maskedKey, setMaskedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [subscription, setSubscription] = useState<{ plan: string; status: string } | null>(null);

  useEffect(() => {
    Promise.all([
      settingsApi
        .getOpenAiKey()
        .then((result) => {
          setMaskedKey(result.api_key);
        })
        .catch(() => setMaskedKey(null)),
      authApi.getSubscription().then((s) => setSubscription(s as any)),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    setMessage(null);

    try {
      await settingsApi.saveOpenAiKey(apiKey);
      setMessage({ type: "success", text: "API key saved successfully" });
      setApiKey("");
      const result = await settingsApi.getOpenAiKey();
      setMaskedKey(result.api_key);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save API key",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteApiKey = async () => {
    setDeleting(true);
    setMessage(null);

    try {
      await settingsApi.deleteOpenAiKey();
      setMessage({ type: "success", text: "API key deleted" });
      setMaskedKey(null);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete API key",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-600">Email</Label>
            <p className="font-medium text-gray-900">{user?.email}</p>
          </div>
          {user?.first_name && (
            <div>
              <Label className="text-gray-600">Name</Label>
              <p className="font-medium text-gray-900">{user.first_name}</p>
            </div>
          )}
          {user?.city_zip && (
            <div>
              <Label className="text-gray-600">Location</Label>
              <p className="font-medium text-gray-900">{user.city_zip}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Current Plan</p>
              <p className="font-semibold text-gray-900 capitalize">
                {subscription?.plan === "pro" ? "LeafMind Pro" : "Free"}
              </p>
            </div>
            {subscription?.status === "active" && (
              <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>OpenAI API Key</CardTitle>
          <CardDescription>
            Optionally provide your own OpenAI API key for faster, personalized responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert
              variant={message.type === "success" ? "default" : "destructive"}
              className={message.type === "success" ? "border-green-200 bg-green-50" : ""}
            >
              <AlertDescription className={message.type === "success" ? "text-green-800" : ""}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {maskedKey && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Saved Key</p>
                <p className="font-mono text-sm text-gray-900">{maskedKey}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteApiKey}
                disabled={deleting}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk_live_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSaveApiKey}
            disabled={saving || !apiKey.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? "Saving..." : "Save API Key"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
