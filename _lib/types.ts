export interface User {
  id: string;
  email: string;
  display_name: string | null;
}

export interface Plant {
  id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
