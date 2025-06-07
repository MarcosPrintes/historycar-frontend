import {
  API_BASE_URL,
  API_ROUTES,
  getDefaultHeaders,
  ApiResponse,
} from "./config";
import {
  MaintenanceRecord,
  CreateMaintenanceData,
  UpdateMaintenanceData,
  MaintenanceFilterParams,
} from "@/domain/maintenance/types";
import AuthService from "./authService";

const MaintenanceService = {
  getMaintenanceRecords: async (
    filters?: MaintenanceFilterParams
  ): Promise<ApiResponse<MaintenanceRecord[]>> => {
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
        ? `${API_BASE_URL}${
            API_ROUTES.MAINTENANCE.BASE
          }?${queryParams.toString()}`
        : `${API_BASE_URL}${API_ROUTES.MAINTENANCE.BASE}`;

      const response = await fetch(url, {
        method: "GET",
        headers: getDefaultHeaders(token),
      });

      const data = await response.json();
      console.log("===> data", data);
      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Falha ao obter registros de manutenção",
          code: response.status.toString(),
        };
      }
      
      // Verificar se os dados estão em data.records ou diretamente em data
      const rawRecords = Array.isArray(data) ? data : 
                                 Array.isArray(data.records) ? data.records : 
                                 Array.isArray(data.data) ? data.data : [];

      // Ensure each record conforms to MaintenanceRecord, especially 'cost'
      const maintenanceRecords: MaintenanceRecord[] = rawRecords.map((record: any) => ({
        ...record,
        cost: parseFloat(record.cost) || 0, // Parse cost to number, default to 0 if NaN
        odometer: parseInt(record.odometer, 10) || 0, // Also ensure odometer is a number
      }));
      
      return {
        success: true,
        message: data.message || "Registros carregados com sucesso",
        data: maintenanceRecords,
      };
    } catch (error) {
      console.error("Erro ao obter registros de manutenção:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },

  getMaintenanceRecord: async (
    id: string
  ): Promise<ApiResponse<MaintenanceRecord>> => {
    try {
      const token = AuthService.getToken();

      if (!token) {
        return {
          success: false,
          message: "Usuário não autenticado",
        };
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.MAINTENANCE.DETAIL(id)}`,
        {
          method: "GET",
          headers: getDefaultHeaders(token),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message || "Falha ao obter detalhes do registro de manutenção",
          code: response.status.toString(),
        };
      }

      return {
        success: true,
        data: data,
        message: data.message,
      };
    } catch (error) {
      console.error("Erro ao obter detalhes do registro de manutenção:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },

  createMaintenanceRecord: async (
    maintenanceData: CreateMaintenanceData
  ): Promise<ApiResponse<MaintenanceRecord>> => {
    try {
      const token = AuthService.getToken();

      if (!token) {
        return {
          success: false,
          message: "Usuário não autenticado",
        };
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.MAINTENANCE.CREATE}`,
        {
          method: "POST",
          headers: getDefaultHeaders(token),
          body: JSON.stringify(maintenanceData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Falha ao criar registro de manutenção",
          code: response.status.toString(),
        };
      }

      return {
        success: true,
        data: data,
        message: data.message,
      };
    } catch (error) {
      console.error("Erro ao criar registro de manutenção:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },

  updateMaintenanceRecord: async (
    maintenanceData: UpdateMaintenanceData
  ): Promise<ApiResponse<MaintenanceRecord>> => {
    try {
      const token = AuthService.getToken();

      if (!token) {
        return {
          success: false,
          message: "Usuário não autenticado",
        };
      }

      const { id, ...updateData } = maintenanceData;

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.MAINTENANCE.UPDATE(id)}`,
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
          message: data.message || "Falha ao atualizar registro de manutenção",
          code: response.status.toString(),
        };
      }

      return {
        success: true,
        data: data,
        message: data.message,
      };
    } catch (error) {
      console.error("Erro ao atualizar registro de manutenção:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },

  deleteMaintenanceRecord: async (id: string): Promise<ApiResponse> => {
    try {
      const token = AuthService.getToken();

      if (!token) {
        return {
          success: false,
          message: "Usuário não autenticado",
        };
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.MAINTENANCE.DELETE(id)}`,
        {
          method: "DELETE",
          headers: getDefaultHeaders(token),
        }
      );

      if (response.status === 204) {
        return {
          success: true,
          message: "Registro de manutenção excluído com sucesso!",
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Falha ao excluir registro de manutenção",
          code: response.status.toString(),
        };
      }

      return {
        success: true,
        data,
        message: data.message,
      };
    } catch (error) {
      console.error("Erro ao excluir registro de manutenção:", error);
      return {
        success: false,
        message: "Erro ao conectar com o servidor",
      };
    }
  },
};

export default MaintenanceService;
