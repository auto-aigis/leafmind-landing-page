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