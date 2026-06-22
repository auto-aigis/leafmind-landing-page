"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { plantApi, chatApi } from "@/app/_lib/api";
import type { Plant, ChatMessage } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Leaf, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PlantPage() {
  const params = useParams();
  const router = useRouter();
  const plantId = params.id as string;
  const [plant, setPlant] = useState<Plant | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    Promise.all([
      plantApi.get(plantId).then(setPlant),
      chatApi.getHistory(plantId).then((h) => setMessages(h.messages)),
    ]).finally(() => setLoading(false));
  }, [plantId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const text = input;
    setInput("");
    setSending(true);
    const optimistic: ChatMessage = {
      id: `tmp-${Date.now()}`, role: "user", content: text,
      confidence_label: null, reasoning_line: null, fallback_step: null,
      feedback: null, created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      const response = await chatApi.sendMessage(plantId, text);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const handleFeedback = async (msgId: string, feedback: "thumbs_up" | "thumbs_down") => {
    try {
      await chatApi.feedback(plantId, msgId, feedback);
      setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, feedback } : m));
    } catch {}
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await plantApi.delete(plantId); router.push("/dashboard"); }
    catch {} finally { setDeleting(false); setShowDelete(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;
  if (!plant) return <div className="p-6 text-gray-500">Plant not found</div>;

  const windowLabel = plant.window_direction
    ? plant.window_direction.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Unknown";

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          {plant.photo_url && !plant.photo_url.startsWith("data:") ? (
            <img src={plant.photo_url} alt={plant.nickname} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
          ) : plant.photo_url?.startsWith("data:") ? (
            <img src={plant.photo_url} alt={plant.nickname} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{plant.nickname}</h1>
            {plant.species && <p className="text-sm text-gray-500">{plant.species}</p>}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowDelete(true)} className="text-red-500 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Context cards */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50 shrink-0">
        {[
          { label: "Pot", value: plant.pot_size || "—" },
          { label: "Soil", value: plant.soil_type || "—" },
          { label: "Window", value: windowLabel },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg px-3 py-2 border border-gray-100 text-center">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-semibold text-gray-800 capitalize">{value}</p>
          </div>
        ))}
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <Leaf className="h-10 w-10 text-gray-200" />
            <p className="text-sm">Ask about your plant's care</p>
            <p className="text-xs text-gray-300">e.g., "My leaves are yellowing, it's been 12 days since I watered"</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === "assistant" && (msg.confidence_label || msg.reasoning_line || msg.fallback_step) && (
                    <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                      {msg.confidence_label && (
                        <p className="text-xs text-green-700 font-medium">📊 {msg.confidence_label}</p>
                      )}
                      {msg.reasoning_line && (
                        <p className="text-xs text-gray-500">💡 {msg.reasoning_line}</p>
                      )}
                      {msg.fallback_step && (
                        <p className="text-xs text-gray-500">🔄 {msg.fallback_step}</p>
                      )}
                    </div>
                  )}
                  {msg.role === "assistant" && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleFeedback(msg.id, "thumbs_up")}
                        className={`text-base transition-opacity ${msg.feedback === "thumbs_up" ? "opacity-100" : "opacity-30 hover:opacity-70"}`}>
                        👍
                      </button>
                      <button onClick={() => handleFeedback(msg.id, "thumbs_down")}
                        className={`text-base transition-opacity ${msg.feedback === "thumbs_down" ? "opacity-100" : "opacity-30 hover:opacity-70"}`}>
                        👎
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 p-4 border-t border-gray-200 bg-white shrink-0">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe symptoms or ask for care advice..."
          disabled={sending}
          className="flex-1"
        />
        <Button type="submit" disabled={sending || !input.trim()} className="bg-green-600 hover:bg-green-700 px-3">
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {plant.nickname}?</DialogTitle>
            <DialogDescription>This cannot be undone. All chat history will be permanently deleted.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
