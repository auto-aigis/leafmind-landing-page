"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { plantApi, chatApi } from "@/app/_lib/api";
import type { Plant, ChatMessage } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Leaf, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    Promise.all([
      plantApi.get(plantId).then(setPlant),
      chatApi.getHistory(plantId).then((h) => setMessages(h.messages)),
    ]).finally(() => setLoading(false));
  }, [plantId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setSending(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      confidence_label: null,
      reasoning_line: null,
      fallback_step: null,
      feedback: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await chatApi.sendMessage(plantId, input);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  };

  const handleFeedback = async (
    msgId: string,
    feedback: "thumbs_up" | "thumbs_down"
  ) => {
    try {
      await chatApi.feedback(plantId, msgId, feedback);
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, feedback } : m))
      );
    } catch (err) {
      console.error("Failed to save feedback", err);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await plantApi.delete(plantId);
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to delete plant", err);
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!plant) return <div className="p-6">Plant not found</div>;

  return (
    <div className="mx-auto max-w-4xl p-6 h-screen flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{plant.nickname}</h1>
          {plant.species && (
            <p className="text-gray-600 text-sm mt-1">{plant.species}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDelete(true)}
          className="text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-gray-200">
          <CardContent className="p-4 text-sm">
            <p className="text-gray-600">Pot Size</p>
            <p className="font-semibold text-gray-900 capitalize">{plant.pot_size}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4 text-sm">
            <p className="text-gray-600">Soil Type</p>
            <p className="font-semibold text-gray-900 capitalize">{plant.soil_type}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4 text-sm">
            <p className="text-gray-600">Window Direction</p>
            <p className="font-semibold text-gray-900 capitalize">{plant.window_direction.replace("_", " ")}</p>
          </CardContent>
        </Card>
      </div>

      {plant.notes && (
        <Card className="mb-6 border-gray-200">
          <CardContent className="p-4 text-sm">
            <p className="text-gray-600 font-medium mb-1">Notes</p>
            <p className="text-gray-900">{plant.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card className="flex-1 flex flex-col border-gray-200 mb-4">
        <CardHeader className="pb-4 border-b border-gray-200">
          <CardTitle className="text-lg">Care Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <Leaf className="h-8 w-8 mb-2 text-gray-300" />
              <p>No messages yet. Ask for care advice!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-sm rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-green-100 text-green-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    {msg.confidence_label && (
                      <p className="text-xs opacity-70 mt-1">Confidence: {msg.confidence_label}</p>
                    )}
                    {msg.reasoning_line && (
                      <p className="text-xs opacity-70 mt-1 font-medium">{msg.reasoning_line}</p>
                    )}
                    {msg.fallback_step && (
                      <p className="text-xs opacity-70 mt-1">Next step: {msg.fallback_step}</p>
                    )}
                    {msg.role === "assistant" && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleFeedback(msg.id, "thumbs_up")}
                          className={`text-lg ${
                            msg.feedback === "thumbs_up" ? "opacity-100" : "opacity-50 hover:opacity-100"
                          }`}
                        >
                          👍
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, "thumbs_down")}
                          className={`text-lg ${
                            msg.feedback === "thumbs_down" ? "opacity-100" : "opacity-50 hover:opacity-100"
                          }`}
                        >
                          👎
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          type="text"
          placeholder="Describe symptoms or ask for care advice..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
          className="border-gray-300"
        />
        <Button
          type="submit"
          disabled={sending || !input.trim()}
          className="bg-green-600 hover:bg-green-700"
        >
          {sending ? "Sending..." : "Send"}
        </Button>
      </form>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="border-gray-200">
          <DialogHeader>
            <DialogTitle>Delete {plant.nickname}?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The plant profile and all chat history will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
