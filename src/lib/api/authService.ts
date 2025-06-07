import {
  API_BASE_URL,
  API_ROUTES,
  getDefaultHeaders,
  ApiResponse,
} from "./config";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/domain/auth/types";
import { setCookie, getCookie, eraseCookie } from "./cookieUtils";

const AuthService = {
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.AUTH.LOGIN}`, {
        method: "POST",
        headers: getDefaultHeaders(),
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Falha na autenticação",
          code: response.status.toString(),
        };
      }

      if (data.token) {
        setCookie("authToken", data.token, 7); // Store cookie for 7 days
      }

      return {
        success: true,
        data,
        message: data.message || "Operação bem-sucedida!",
      };
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },

  register: async (userData: RegisterData): Promise<ApiResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.AUTH.REGISTER}`,
        {
          method: "POST",
          headers: getDefaultHeaders(),
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Falha no registro",
          code: response.status.toString(),
        };
      }

      return {
        success: true,
        data,
        message: data.message || "Operação bem-sucedida!",
      };
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },

  logout: (): void => {
    eraseCookie("authToken");
  },

  isAuthenticated: (): boolean => {
    const token = getCookie("authToken");
    return !!token;
  },

  getToken: (): string | null => {
    return getCookie("authToken");
  },

  getProfile: async (): Promise<ApiResponse> => {
    try {
      const token = AuthService.getToken();

      if (!token) {
        return {
          success: false,
          message: "Usuário não autenticado",
        };
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.AUTH.PROFILE}`,
        {
          method: "GET",
          headers: getDefaultHeaders(token),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Falha ao obter perfil",
          code: response.status.toString(),
        };
      }

      return {
        success: true,
        data,
        message: data.message || "Operação bem-sucedida!",
      };
    } catch (error) {
      console.error("Erro ao obter perfil:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },
};

export default AuthService;
