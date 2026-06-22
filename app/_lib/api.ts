const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d)) msg = d.map((e: any) => e.msg).join(", ");
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function apiFetchFormData<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d)) msg = d.map((e: any) => e.msg).join(", ");
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

import type { User, Subscription, Plant, ChatMessage, ChatHistory, ApiKey } from "./types";

export const authApi = {
  register: (email: string, password: string) =>
    apiFetch<{ status: string; email: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    apiFetch<User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => apiFetch<{ status: string }>("/api/auth/logout", { method: "POST" }),

  me: () => apiFetch<User>("/api/auth/me"),

  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  onboarding: (first_name: string, city_zip: string, plant_count_estimate: number) =>
    apiFetch<{ status: string }>("/api/auth/onboarding", {
      method: "PUT",
      body: JSON.stringify({ first_name, city_zip, plant_count_estimate }),
    }),

  getSubscription: () => apiFetch<Subscription>("/api/auth/subscription"),

  resendVerification: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

export const plantApi = {
  list: () => apiFetch<Plant[]>("/api/plants"),

  create: (plant: Partial<Plant>) =>
    apiFetch<Plant>("/api/plants", {
      method: "POST",
      body: JSON.stringify(plant),
    }),

  get: (id: string) => apiFetch<Plant>(`/api/plants/${id}`),

  update: (id: string, plant: Partial<Plant>) =>
    apiFetch<Plant>(`/api/plants/${id}`, {
      method: "PUT",
      body: JSON.stringify(plant),
    }),

  delete: (id: string) =>
    apiFetch<{ status: string }>(`/api/plants/${id}`, { method: "DELETE" }),

  checkUpgrade: () =>
    apiFetch<{ can_add_plant: boolean; plant_count: number; tier: string }>(
      "/api/plants/check-upgrade"
    ),

  uploadPhoto: (plantId: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiFetchFormData<{ photo_url: string }>(
      `/api/plants/${plantId}/upload-photo`,
      { method: "POST", body: form }
    );
  },
};

export const chatApi = {
  getHistory: (plantId: string) =>
    apiFetch<ChatHistory>(`/api/plants/${plantId}/chat`),

  sendMessage: (plantId: string, message: string) =>
    apiFetch<ChatMessage>(`/api/plants/${plantId}/chat`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  feedback: (plantId: string, msgId: string, feedback: "thumbs_up" | "thumbs_down") =>
    apiFetch<{ status: string }>(`/api/plants/${plantId}/chat/${msgId}/feedback`, {
      method: "POST",
      body: JSON.stringify({ feedback }),
    }),
};

export const settingsApi = {
  getApiKeys: () => apiFetch<ApiKey[]>("/api/settings/keys"),

  getOpenAiKey: () =>
    apiFetch<{ api_key: string | null }>("/api/settings/apikey"),

  saveOpenAiKey: (api_key: string) =>
    apiFetch<{ status: string }>("/api/settings/apikey", {
      method: "PUT",
      body: JSON.stringify({ api_key }),
    }),

  deleteOpenAiKey: () =>
    apiFetch<{ status: string }>("/api/settings/apikey", { method: "DELETE" }),
};

export const waitlistApi = {
  join: (email: string, source: string = "direct") =>
    apiFetch<{ status: string }>("/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email, source }),
    }),
};
