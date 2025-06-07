// Interfaces relacionadas a registros de manutenção

// Modelo de registro de manutenção
export interface MaintenanceRecord {
  id: string;
  carFkId: string;
  serviceType: string;
  description: string;
  date: string;
  odometer: number;
  cost: number;
  mechanicName: string;
  createdAt: string;
  updatedAt: string;
  placa?: string;
  modelo?: string;
}

// Dados para criação de registro de manutenção
export interface CreateMaintenanceData {
  date: string;
  serviceType: string;
  description: string;
  cost: number;
  mileage: number;
  carFkId: string;
  placeName: string;
  mechanicName: string;
}

// Dados para atualização de registro de manutenção
export interface UpdateMaintenanceData extends Partial<CreateMaintenanceData> {
  id: string;
}

// Parâmetros para filtragem de registros de manutenção
export interface MaintenanceFilterParams {
  vehicleId?: string;
  service?: string;
  startDate?: string;
  endDate?: string;
  minCost?: number;
  maxCost?: number;
  completed?: boolean;
  userId?: string;
  page?: number;
  limit?: number;
}

// Tipos de serviços de manutenção comuns (para sugestões na UI)
export enum MaintenanceServiceType {
  OIL_CHANGE = "Troca de óleo",
  TIRE_ROTATION = "Rodízio de pneus",
  BRAKE_SERVICE = "Serviço de freios",
  BATTERY_REPLACEMENT = "Substituição de bateria",
  AIR_FILTER_REPLACEMENT = "Substituição de filtro de ar",
  FUEL_FILTER_REPLACEMENT = "Substituição de filtro de combustível",
  SPARK_PLUG_REPLACEMENT = "Substituição de velas",
  TIMING_BELT_REPLACEMENT = "Substituição de correia dentada",
  COOLANT_FLUSH = "Troca de líquido de arrefecimento",
  TRANSMISSION_SERVICE = "Serviço de transmissão",
  WHEEL_ALIGNMENT = "Alinhamento de rodas",
  WHEEL_BALANCING = "Balanceamento de rodas",
  INSPECTION = "Inspeção geral",
  OTHER = "Outro",
}
