export interface OSCECase {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  audioUrl: string;
}

export interface User {
  email: string;
  role: "student" | "teacher";
  name: string;
  id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  role: "student" | "teacher";
  token?: string;
  error?: string;
}