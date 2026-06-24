const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
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
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, name: string) =>
    apiFetch<{ status: string; email: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name: name }),
    }),

  login: (email: string, password: string) =>
    apiFetch<{ user: any }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => apiFetch<{ status: string }>("/api/auth/logout", { method: "POST" }),

  me: () => apiFetch<{ user: any | null }>("/api/auth/me"),

  resendVerification: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

export const waitlistApi = {
  submit: (email: string, source: string) =>
    apiFetch<{ status: string }>("/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email, source }),
    }),
};

export const plantApi = {
  list: () => apiFetch<{ plants: any[] }>("/api/plants"),
  
  get: (id: string) => apiFetch<{ plant: any }>(`/api/plants/${id}`),
  
  create: (formData: FormData) => apiFetchFormData<{ plant: any }>("/api/plants", {
    method: "POST",
    body: formData,
  }),
  
  update: (id: string, formData: FormData) => apiFetchFormData<{ plant: any }>(`/api/plants/${id}`, {
    method: "PUT",
    body: formData,
  }),
  
  delete: (id: string) => apiFetch<{ status: string }>(`/api/plants/${id}`, {
    method: "DELETE",
  }),
};

export const chatApi = {
  sendMessage: (plantId: string, message: string) =>
    apiFetch<{ response: string }>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ plant_id: plantId, message }),
    }),
  
  getHistory: (plantId: string) =>
    apiFetch<{ messages: any[] }>(`/api/chat/${plantId}`),
};
