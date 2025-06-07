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
          error: {
            message: data.message || "Falha na autenticação",
            code: response.status.toString(),
          },
        };
      }

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("isAuthenticated", "true");
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      return {
        success: false,
        error: {
          message: "Erro ao conectar com o servidor",
        },
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
          error: {
            message: data.message || "Falha no registro",
            code: response.status.toString(),
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      return {
        success: false,
        error: {
          message: "Erro ao conectar com o servidor",
        },
      };
    }
  },

  logout: (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuthenticated");
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("authToken");
    const isAuth = localStorage.getItem("isAuthenticated");
    return !!token && !!isAuth;
  },

  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  getProfile: async (): Promise<ApiResponse> => {
    try {
      const token = AuthService.getToken();

      if (!token) {
        return {
          success: false,
          error: {
            message: "Usuário não autenticado",
          },
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
          error: {
            message: data.message || "Falha ao obter perfil",
            code: response.status.toString(),
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Erro ao obter perfil:", error);
      return {
        success: false,
        error: {
          message: "Erro ao conectar com o servidor",
        },
      };
    }
  },
};

export default AuthService;
