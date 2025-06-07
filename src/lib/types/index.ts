// Vehicle types
export interface Vehicle {
  id: number;
  make: string;
  modelo: string;
  year: number;
  placa: string;
  color: string;
}

// Maintenance record types
export interface MaintenanceRecord {
  id: number;
  vehicleName: string;
  service: string;
  date: string;
  mileage: number;
  cost: number;
  notes: string;
  shopName: string;
}
