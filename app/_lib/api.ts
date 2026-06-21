const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiCall<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
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
      if (typeof d === 'string') {
        msg = d;
      } else if (Array.isArray(d)) {
        msg = d.map((e: any) => e.msg).join(', ');
      } else if (err.error) {
        msg = err.error;
      }
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

export const authApi = {
  register: (email: string, password: string, displayName?: string) =>
    apiCall<{ status: string; email: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        display_name: displayName,
      }),
    }),

  login: (email: string, password: string) =>
    apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiCall('/api/auth/logout', { method: 'POST' }),

  me: () =>
    apiCall('/api/auth/me'),

  verifyEmail: (token: string) =>
    apiCall('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    apiCall<{ status: string }>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  getSubscription: () =>
    apiCall('/api/auth/subscription'),
};

export const paddleApi = {
  verifyTransaction: (transactionId: string) =>
    apiCall('/api/payments/verify-transaction', {
      method: 'POST',
      body: JSON.stringify({ transaction_id: transactionId }),
    }),
};
