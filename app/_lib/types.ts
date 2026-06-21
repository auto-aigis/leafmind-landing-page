export interface User {
  id: string;
  email: string;
  display_name: string;
  is_email_verified: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  status: 'active' | 'inactive' | 'canceled' | 'paused';
  tier: 'free' | 'pro' | 'plus';
  paddle_subscription_id: string;
  current_period_end: string | null;
}

export interface AuthResponse {
  id: string;
  email: string;
  display_name: string;
  is_email_verified: boolean;
  created_at: string;
}