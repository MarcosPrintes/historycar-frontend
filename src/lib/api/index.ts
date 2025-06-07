import AuthService from './authService';
import { API_BASE_URL, API_ROUTES } from './config';

// Exportar todos os serviços e configurações da API
export {
  AuthService,
  API_BASE_URL,
  API_ROUTES
};

// Função de utilidade para fazer requisições à API
export async function fetchWithAuth<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = AuthService.getToken();
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    // Se o token estiver expirado (401), fazer logout
    if (response.status === 401) {
      AuthService.logout();
      window.location.href = '/auth/login';
    }
    
    throw new Error(`Erro na requisição: ${response.status}`);
  }
  
  return response.json();
}
