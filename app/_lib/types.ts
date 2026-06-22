export interface User {
  id: string;
  email: string;
  first_name: string | null;
  city_zip: string | null;
  plant_count_estimate: number | null;
  onboarding_complete: boolean;
  is_email_verified: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  status: "active" | "inactive";
  plan: "free" | "pro";
  current_period_end: string;
}

export interface Plant {
  id: string;
  nickname: string;
  species: string | null;
  photo_url: string | null;
  pot_size: "small" | "medium" | "large" | "xl";
  soil_type: "standard" | "cactus" | "orchid" | "peat" | "custom";
  window_direction: "north" | "south" | "east" | "west" | "no_window";
  notes: string | null;
  last_chat_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence_label: string | null;
  reasoning_line: string | null;
  fallback_step: string | null;
  feedback: "thumbs_up" | "thumbs_down" | null;
  created_at: string;
}

export interface ChatHistory {
  messages: ChatMessage[];
}

export interface ApiKey {
  service_name: string;
  masked_key: string;
}
