const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const token = options?.token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
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

import * as types from './types';

export const authApi = {
  me: (token: string) => apiFetch<types.AuthMeResponse>('/api/auth/me', { token }),
  subscription: (token: string) => apiFetch<types.Subscription>('/api/auth/subscription', { token }),
  logout: (token: string) => apiFetch<types.LogoutResponse>('/api/auth/logout', { token, method: 'POST' }),
};

export const plantApi = {
  list: (token: string) => apiFetch<types.Plant[]>('/api/plants', { token }),
  create: (token: string, data: Omit<types.Plant, 'id' | 'photo_url' | 'health_status' | 'last_chat_at' | 'created_at'>) =>
    apiFetch<types.Plant>('/api/plants', { token, method: 'POST', body: JSON.stringify(data) }),
  get: (token: string, id: string) => apiFetch<types.Plant>(`/api/plants/${id}`, { token }),
  update: (token: string, id: string, data: Partial<types.Plant>) =>
    apiFetch<types.Plant>(`/api/plants/${id}`, { token, method: 'PUT', body: JSON.stringify(data) }),
  delete: (token: string, id: string) => apiFetch<{ status: string }>(`/api/plants/${id}`, { token, method: 'DELETE' }),
  uploadPhoto: async (token: string, id: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/api/plants/${id}/photo`, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    const { photo_url } = await res.json();
    return photo_url;
  },
};

export const chatApi = {
  getMessages: (token: string, plantId: string) =>
    apiFetch<types.Message[]>(`/api/plants/${plantId}/messages`, { token }),
  sendMessage: (token: string, plantId: string, content: string, imageUrl?: string) =>
    apiFetch<types.Message>(`/api/plants/${plantId}/chat`, {
      token,
      method: 'POST',
      body: JSON.stringify({ content, image_url: imageUrl }),
    }),
  getCarePlan: (token: string, plantId: string) =>
    apiFetch<types.CarePlan>(`/api/plants/${plantId}/care-plan`, { token }),
  getExport: (token: string, plantId: string) =>
    apiFetch<types.ExportResponse>(`/api/plants/${plantId}/export`, { token }),
  getCompatibility: (token: string, plantId: string) =>
    apiFetch<types.CompatibilityResponse>(`/api/plants/${plantId}/compatibility`, { token }),
};

export const zoneApi = {
  list: (token: string) => apiFetch<types.Zone[]>('/api/zones', { token }),
  create: (token: string, data: Omit<types.Zone, 'id' | 'created_at'>) =>
    apiFetch<types.Zone>('/api/zones', { token, method: 'POST', body: JSON.stringify(data) }),
  update: (token: string, id: string, data: Partial<types.Zone>) =>
    apiFetch<types.Zone>(`/api/zones/${id}`, { token, method: 'PUT', body: JSON.stringify(data) }),
  delete: (token: string, id: string) => apiFetch<{ status: string }>(`/api/zones/${id}`, { token, method: 'DELETE' }),
};

export const propagationApi = {
  list: (token: string, plantId: string) =>
    apiFetch<types.PropagationItem[]>(`/api/plants/${plantId}/propagation`, { token }),
  create: (token: string, plantId: string, data: Omit<types.PropagationItem, 'id' | 'plant_id' | 'started_at' | 'created_at' | 'status'>) =>
    apiFetch<types.PropagationItem>(`/api/plants/${plantId}/propagation`, {
      token,
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const settingsApi = {
  getApiKey: (token: string) => apiFetch<types.ApiKeyResponse>('/api/settings/apikey', { token }),
  setApiKey: (token: string, apiKey: string) =>
    apiFetch<{ status: string }>('/api/settings/apikey', { token, method: 'PUT', body: JSON.stringify({ api_key: apiKey }) }),
  deleteApiKey: (token: string) => apiFetch<{ status: string }>('/api/settings/apikey', { token, method: 'DELETE' }),
};

export const paymentApi = {
  verifyTransaction: (token: string, transactionId: string) =>
    apiFetch<types.VerifyTransactionResponse>('/api/payments/verify-transaction', {
      token,
      method: 'POST',
      body: JSON.stringify({ transaction_id: transactionId }),
    }),
};
