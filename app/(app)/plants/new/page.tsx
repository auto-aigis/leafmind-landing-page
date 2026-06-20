"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { plantApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UpgradeModal } from "../_components/UpgradeModal";

export default function NewPlantPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [nickname, setNickname] = useState("");
  const [species, setSpecies] = useState("");
  const [potSize, setPotSize] = useState<"small" | "medium" | "large" | "xl">("medium");
  const [soilType, setSoilType] = useState<"standard" | "cactus" | "orchid" | "peat" | "custom">("standard");
  const [windowDirection, setWindowDirection] = useState<"north" | "south" | "east" | "west" | "no_window">("south");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await plantApi.create({
        nickname,
        species: species || null,
        pot_size: potSize,
        soil_type: soilType,
        window_direction: windowDirection,
        notes: notes || null,
      });
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create plant";
      if (message.includes("upgrade_required")) {
        setShowUpgrade(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-2xl p-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl">Add a New Plant</CardTitle>
            <CardDescription>Tell us about your plant so we can give better care advice</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="nickname">Plant Nickname *</Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="e.g., Big Monstera, Sunny Succulent"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="species">Species (Optional)</Label>
                <Input
                  id="species"
                  type="text"
                  placeholder="e.g., Monstera deliciosa"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="potSize">Pot Size</Label>
                  <Select value={potSize} onValueChange={(v) => setPotSize(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="xl">XL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Select value={soilType} onValueChange={(v) => setSoilType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="cactus">Cactus</SelectItem>
                      <SelectItem value="orchid">Orchid</SelectItem>
                      <SelectItem value="peat">Peat</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="windowDirection">Window Direction</Label>
                <Select value={windowDirection} onValueChange={(v) => setWindowDirection(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                    <SelectItem value="no_window">No Window</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g., Near a heating vent, gets afternoon sun"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-24"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Plant"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
    </>
  );
}
