export interface User {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  submitted_at: string;
  source: string;
}

export interface AuthResponse {
  user: User | null;
  session_token?: string;
}