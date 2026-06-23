const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === 'string') msg = d;
      else if (Array.isArray(d)) msg = d.map((e: any) => e.msg).join(', ');
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

export const authApi = {
  register: (email: string, password: string, display_name: string) =>
    apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name }),
    }),
  login: (email: string, password: string) =>
    apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),
  me: () => apiFetch('/api/auth/me'),
  verifyEmail: (token: string) =>
    apiFetch('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
  resendVerification: (email: string) =>
    apiFetch('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  subscription: () => apiFetch('/api/auth/subscription'),
};

export const plantsApi = {
  list: () => apiFetch('/api/plants'),
  create: (name: string, species: string, notes: string) =>
    apiFetch('/api/plants', {
      method: 'POST',
      body: JSON.stringify({ name, species, notes }),
    }),
  get: (id: string) => apiFetch(`/api/plants/${id}`),
  update: (id: string, data: Partial<{name: string; species: string; notes: string; last_watered_at: string}>) =>
    apiFetch(`/api/plants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => apiFetch(`/api/plants/${id}`, { method: 'DELETE' }),
  insights: (id: string) => apiFetch(`/api/plants/${id}/insights`),
};

export const paymentsApi = {
  verifyTransaction: (transaction_id: string) =>
    apiFetch('/api/payments/verify-transaction', {
      method: 'POST',
      body: JSON.stringify({ transaction_id }),
    }),
};
