import {
  API_BASE_URL,
  API_ROUTES,
  getDefaultHeaders,
  ApiResponse,
} from "./config";
import {
  Vehicle,
  CreateVehicleData,
  UpdateVehicleData,
  VehicleFilterParams,
} from "@/domain/vehicle/types";
import AuthService from "./authService";

const VehicleService = {
  getVehicles: async (
    filters?: VehicleFilterParams
  ): Promise<ApiResponse<Vehicle[]>> => {
    try {
      const token = AuthService.getToken();

      if (!token) {
        return {
          success: false,
          message: "Usuário não autenticado",
        };
      }

      const queryParams = filters ? new URLSearchParams() : undefined;
      if (filters && queryParams) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }

      const url = queryParams
        ? `${API_BASE_URL}${API_ROUTES.VEHICLES.BASE}?${queryParams.toString()}`
        : `${API_BASE_URL}${API_ROUTES.VEHICLES.BASE}`;

      const response = await fetch(url, {
        method: "GET",
        headers: getDefaultHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Falha ao obter veículos",
          code: response.status.toString(),
        };
      }

      return {
        success: true,
        data: data.data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao conectar com o servidor: ${error}`,
      };
    }
  },

  getVehicle: async (id: string): Promise<ApiResponse<Vehicle>> => {
    try {
      const token = AuthService.getToken();

      if (!token) {
        return {
          success: false,
          message: "Usuário não autenticado",
        };
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.VEHICLES.DETAIL(id)}`,
        {
          method: "GET",
          headers: getDefaultHeaders(token),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message,
          code: response.status.toString(),
        };
      }

      return {
        success: true,
        data: data,
        message: data.message,
      };
    } catch (error) {
      console.error("Erro ao obter detalhes do veículo:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },

  /**
   * Cria um novo veículo enviando apenas os campos necessários
   * @param vehicleData Dados do veículo (modelo, placa)
   * @returns Resposta da API com o veículo criado
   */
  createVehicle: async (
    vehicleData: CreateVehicleData
  ): Promise<ApiResponse<Vehicle>> => {
    try {
      const token = AuthService.getToken();

      if (!token) {
        return {
          success: false,
          message: "Usuário não autenticado",
        };
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.VEHICLES.CREATE}`,
        {
          method: "POST",
          headers: getDefaultHeaders(token),
          body: JSON.stringify(vehicleData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message,
        };
      }

      return {
        success: true,
        data: data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao conectar com o servidor: ${error}`,
      };
    }
  },

  updateVehicle: async (
    vehicleData: UpdateVehicleData
  ): Promise<ApiResponse<Vehicle>> => {
    try {
      const token = AuthService.getToken();

      if (!token) {
        return {
          success: false,
          message: "Usuário não autenticado",
        };
      }

      const { id, ...updateData } = vehicleData;

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.VEHICLES.UPDATE(id)}`,
        {
          method: "PUT",
          headers: getDefaultHeaders(token),
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message,
        };
      }

      return {
        success: true,
        data: data,
        message: data.message,
      };
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error);
      return {
        success: false,
        message: `Erro ao conectar com o servidor: ${error}`,
      };
    }
  },

  deleteVehicle: async (id: string): Promise<ApiResponse> => {
    try {
      const token = AuthService.getToken();

      if (!token) {
        return {
          success: false,
          message: "Usuário não autenticado",
        };
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.VEHICLES.DELETE(id)}`,
        {
          method: "DELETE",
          headers: getDefaultHeaders(token),
        }
      );

      if (response.status === 204) {
        return {
          success: true,
          message: "Veículo excluído com sucesso!",
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message,
        };
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error("Erro ao excluir veículo:", error);
      return {
        success: false,
        message: `Erro ao conectar com o servidor: ${error}`,
      };
    }
  },
};

export default VehicleService;
