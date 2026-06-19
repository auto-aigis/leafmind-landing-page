export interface User {
  id: string;
  email: string;
  display_name: string;
  tier: 'free' | 'pro' | 'collector';
}

export interface Subscription {
  tier: 'free' | 'pro' | 'collector';
  status: 'active' | 'inactive' | 'canceled' | 'paused';
  current_period_end: string;
}

export interface Plant {
  id: string;
  nickname: string;
  species: string | null;
  photo_url: string | null;
  pot_size: string;
  soil_type: string;
  window_direction: 'N' | 'S' | 'E' | 'W';
  zip_code: string;
  health_status: 'unknown' | 'healthy' | 'needs_attention';
  last_chat_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image_url?: string;
  confidence_label?: string;
  reasoning?: string;
  created_at: string;
}

export interface Zone {
  id: string;
  name: string;
  humidity: number;
  light_level: string;
  notes: string;
  created_at: string;
}

export interface PropagationItem {
  id: string;
  plant_id: string;
  type: 'cutting' | 'offset' | 'seed';
  started_at: string;
  notes: string;
  status: 'active' | 'rooting' | 'established';
  created_at: string;
}

export interface CarePlan {
  plant_id: string;
  plan: string;
  generated_at: string;
}

export interface ExportResponse {
  csv: string;
}

export interface CompatibilityResponse {
  recommendations: string;
}

export interface PhotoUploadResponse {
  photo_url: string;
}

export interface AuthMeResponse {
  id: string;
  email: string;
  display_name: string;
  tier: 'free' | 'pro' | 'collector';
}

export interface LogoutResponse {
  status: string;
}

export interface ApiKeyResponse {
  has_key: boolean;
  masked_key: string;
}

export interface VerifyTransactionResponse {
  status: string;
  tier: string;
}
