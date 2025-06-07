// Interfaces relacionadas a veículos

// Modelo de veículo
export interface Vehicle {
  id: string;
  placa: string;
  modelo: string;
  userIdFk: string;
}

// Dados para criação de veículo
export interface CreateVehicleData {
  modelo: string; // modelo
  placa: string; // placa (anteriormente placa)
}

// Dados para atualização de veículo
export interface UpdateVehicleData extends Partial<CreateVehicleData> {
  id: string;
}

// Parâmetros para filtragem de veículos
export interface VehicleFilterParams {
  make?: string;
  modelo?: string;
  year?: number;
  userId?: string;
  page?: number;
  limit?: number;
}
