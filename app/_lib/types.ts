export interface User {
  id: string;
  email: string;
  display_name: string;
  tier: 'free' | 'grower' | 'botanist';
  is_email_verified: boolean;
  created_at: string;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  notes: string;
  last_watered_at: string | null;
  created_at: string;
}

export interface Subscription {
  tier: 'free' | 'grower' | 'botanist';
  status: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  display_name: string;
  tier: 'free' | 'grower' | 'botanist';
  is_email_verified: boolean;
  created_at: string;
}

export interface RegisterResponse {
  status: string;
  email: string;
}

export interface VerifyEmailResponse {
  status: string;
}

export interface PlantInsights {
  plant_id: string;
  species: string;
  insights: string;
}
