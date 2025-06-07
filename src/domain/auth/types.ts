// Interfaces relacionadas à autenticação

// Credenciais de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Dados para registro de usuário
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Resposta da API de autenticação
export interface AuthResponse {
  user: User;
  token: string;
}

// Modelo de usuário
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}
