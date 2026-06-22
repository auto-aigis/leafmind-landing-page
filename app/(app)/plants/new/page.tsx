"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { plantApi, apiFetchFormData } from "@/app/_lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UpgradeModal } from "../_components/UpgradeModal";
import { ImagePlus, X } from "lucide-react";

export default function NewPlantPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState("");
  const [species, setSpecies] = useState("");
  const [potSize, setPotSize] = useState("medium");
  const [soilType, setSoilType] = useState("standard");
  const [windowDirection, setWindowDirection] = useState("south");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const plant = await plantApi.create({
        nickname,
        species: species || undefined,
        pot_size: potSize as any,
        soil_type: soilType as any,
        window_direction: windowDirection as any,
        notes: notes || undefined,
      });

      if (photo && plant.id) {
        const formData = new FormData();
        formData.append("file", photo);
        try {
          await apiFetchFormData(`/api/plants/${plant.id}/upload-photo`, {
            method: "POST",
            body: formData,
          });
        } catch {
          // Photo upload failure is non-fatal
        }
      }

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
                <Label>Photo (Optional)</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-green-400 transition-colors relative"
                >
                  {photoPreview ? (
                    <div className="relative">
                      <img src={photoPreview} alt="Preview" className="mx-auto max-h-48 rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPhoto(null); setPhotoPreview(null); }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4 text-gray-400">
                      <ImagePlus className="h-8 w-8" />
                      <span className="text-sm">Click to upload a photo</span>
                      <span className="text-xs">JPG, PNG, WebP up to 10MB</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">Plant Nickname *</Label>
                <Input
                  id="nickname"
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
                  placeholder="e.g., Monstera deliciosa"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pot Size</Label>
                  <Select value={potSize} onValueChange={setPotSize}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="xl">XL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Soil Type</Label>
                  <Select value={soilType} onValueChange={setSoilType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                <Label>Window Direction</Label>
                <Select value={windowDirection} onValueChange={setWindowDirection}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North-facing</SelectItem>
                    <SelectItem value="south">South-facing</SelectItem>
                    <SelectItem value="east">East-facing</SelectItem>
                    <SelectItem value="west">West-facing</SelectItem>
                    <SelectItem value="no_window">No Window</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g., Near a heating vent, gets afternoon sun, last watered 2 weeks ago"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-24"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? "Creating..." : "Create Plant"}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
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
