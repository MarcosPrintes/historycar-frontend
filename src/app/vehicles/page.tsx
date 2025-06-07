"use client";

import React, { useEffect, useReducer, useState } from "react";
import { useRouter } from 'next/navigation';
import MainLayout from "@/components/layouts/MainLayout";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { Vehicle, CreateVehicleData } from "@/domain/vehicle/types";
import { CreateMaintenanceData } from "@/domain/maintenance/types";
import { toast } from "react-toastify";
import VehicleService from "@/lib/api/vehicleService";
import MaintenanceService from "@/lib/api/maintenanceService";
import AddVehicleModal from "@/components/vehicles/AddVehicleModal";
import DeleteVehicleModal from "@/components/vehicles/DeleteVehicleModal";
import AddMaintenanceModal from "@/components/vehicles/AddMaintenanceModal";
import Loading from "@/components/ui/Loading";
import AuthService from '@/lib/api/authService';
import { LoadingSpinnerIcon } from "@/components/ui/Icons";

type VehicleState = {
  vehicles: Vehicle[];
  ui: {
    isLoadingVehicles: boolean;
    isLoading: boolean;
    showAddModal: boolean;
    showAddMaintenanceModal: boolean;
  };
  deletion: {
    isDeleting: boolean;
    deletingId: string | null;
    showConfirmModal: boolean;
    vehicleToDelete: Vehicle | null;
  };
  maintenance: {
    selectedVehicle: Vehicle | null;
  };
};

type VehicleAction =
  | { type: "SET_VEHICLES"; payload: Vehicle[] }
  | { type: "SET_LOADING_VEHICLES"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SHOW_ADD_MODAL"; payload: boolean }
  | { type: "SHOW_ADD_MAINTENANCE_MODAL"; payload: boolean }
  | { type: "SET_SELECTED_VEHICLE"; payload: Vehicle | null }
  | { type: "START_DELETE"; payload: Vehicle }
  | { type: "CANCEL_DELETE" }
  | { type: "SET_DELETING"; payload: boolean }
  | { type: "SET_DELETING_ID"; payload: string | null };

function vehicleReducer(
  state: VehicleState,
  action: VehicleAction
): VehicleState {
  switch (action.type) {
    case "SET_VEHICLES":
      return { ...state, vehicles: action.payload };
    case "SET_LOADING_VEHICLES":
      return {
        ...state,
        ui: { ...state.ui, isLoadingVehicles: action.payload },
      };
    case "SET_LOADING":
      return { ...state, ui: { ...state.ui, isLoading: action.payload } };
    case "SHOW_ADD_MODAL":
      return { ...state, ui: { ...state.ui, showAddModal: action.payload } };
    case "SHOW_ADD_MAINTENANCE_MODAL":
      return {
        ...state,
        ui: { ...state.ui, showAddMaintenanceModal: action.payload },
      };
    case "SET_SELECTED_VEHICLE":
      return {
        ...state,
        maintenance: { ...state.maintenance, selectedVehicle: action.payload },
      };
    case "START_DELETE":
      return {
        ...state,
        deletion: {
          ...state.deletion,
          showConfirmModal: true,
          vehicleToDelete: action.payload,
        },
      };
    case "CANCEL_DELETE":
      return {
        ...state,
        deletion: {
          ...state.deletion,
          showConfirmModal: false,
          vehicleToDelete: null,
          isDeleting: false,
          deletingId: null,
        },
      };
    case "SET_DELETING":
      return {
        ...state,
        deletion: { ...state.deletion, isDeleting: action.payload },
      };
    case "SET_DELETING_ID":
      return {
        ...state,
        deletion: { ...state.deletion, deletingId: action.payload },
      };
    default:
      return state;
  }
}

export default function VehiclesPage() {
  const router = useRouter();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const initialState: VehicleState = {
    vehicles: [],
    ui: {
      isLoadingVehicles: true,
      isLoading: false,
      showAddModal: false,
      showAddMaintenanceModal: false,
    },
    deletion: {
      isDeleting: false,
      deletingId: null,
      showConfirmModal: false,
      vehicleToDelete: null,
    },
    maintenance: {
      selectedVehicle: null,
    },
  };

  const [state, dispatch] = useReducer(vehicleReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await AuthService.isAuthenticated();
      if (authStatus) {
        setIsUserAuthenticated(true);
      } else {
        router.push('/auth/login');
      }
      setIsAuthLoading(false);
    };
    checkAuth();
  }, [router]);

  const loadVehicles = async () => {
    try {
      dispatch({ type: "SET_LOADING_VEHICLES", payload: true });
      const response = await VehicleService.getVehicles();

      if (response.success && response.data) {
        dispatch({ type: "SET_VEHICLES", payload: response.data });
      } else {
        toast.error(
          "Erro ao carregar veículos: " +
            (response?.message || "Erro desconhecido")
        );
      }
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
      toast.error(
        "Não foi possível conectar ao servidor. Verifique sua conexão."
      );
    } finally {
      dispatch({ type: "SET_LOADING_VEHICLES", payload: false });
    }
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      loadVehicles();
    }
  }, [isUserAuthenticated]);

  const handleDeleteClick = (vehicle: Vehicle) => {
    dispatch({ type: "START_DELETE", payload: vehicle });
  };

  const handleAddMaintenanceClick = (vehicle: Vehicle) => {
    dispatch({ type: "SET_SELECTED_VEHICLE", payload: vehicle });
    dispatch({ type: "SHOW_ADD_MAINTENANCE_MODAL", payload: true });
  };

  const handleAddMaintenance = async (data: CreateMaintenanceData) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await MaintenanceService.createMaintenanceRecord(data);

      if (response.success && response.data) {
        dispatch({ type: "SHOW_ADD_MAINTENANCE_MODAL", payload: false });
        dispatch({ type: "SET_SELECTED_VEHICLE", payload: null });

        // Use success message from service if available, otherwise use a default
        toast.success(response.message || "Manutenção adicionada com sucesso!");
      } else {
        // Display error message from service
        const errorMessage =
          response.message || "Erro ao adicionar manutenção.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Erro ao adicionar manutenção:", error);
      toast.error(
        "Erro ao conectar com o servidor. Tente novamente mais tarde."
      );
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleDeleteVehicle = async () => {
    if (!state.deletion.vehicleToDelete) return;

    try {
      dispatch({ type: "SET_DELETING", payload: true });
      dispatch({
        type: "SET_DELETING_ID",
        payload: state.deletion.vehicleToDelete.id,
      });

      const response = await VehicleService.deleteVehicle(
        state.deletion.vehicleToDelete.id
      );

      if (response.success) {
        dispatch({ type: "CANCEL_DELETE" });

        await loadVehicles();

        toast.success("Veículo excluído com sucesso!");
      } else {
        let errorMessage = "Erro ao excluir veículo.";

        if (response?.code === "401") {
          errorMessage =
            "Você precisa estar autenticado para excluir um veículo.";
        } else if (response?.code === "404") {
          errorMessage = "Veículo não encontrado.";
        } else if (response?.message) {
          errorMessage = response.message;
        }

        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Erro ao excluir veículo:", error);
      toast.error(
        "Erro ao conectar com o servidor. Tente novamente mais tarde."
      );
    } finally {
      dispatch({ type: "SET_DELETING", payload: false });
      dispatch({ type: "SET_DELETING_ID", payload: null });
    }
  };

  const handleAddVehicle = async (data: CreateVehicleData) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const vehicleData: CreateVehicleData = {
        modelo: data.modelo,
        placa: data.placa,
      };

      const response = await VehicleService.createVehicle(vehicleData);

      if (response.success && response.data) {
        dispatch({ type: "SHOW_ADD_MODAL", payload: false });

        await loadVehicles();

        // Use success message from service if available, otherwise use a default
        toast.success(response.message || "Veículo adicionado com sucesso!");
      } else {
        // Direct handling of the inconsistent response structure from createVehicle
        // which might have the message directly at root level or in the error object
        const errorMessage =
          response.message || response?.message || "Erro ao adicionar veículo.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Erro ao adicionar veículo:", error);
      toast.error(
        "Erro ao conectar com o servidor. Tente novamente mais tarde."
      );
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinnerIcon className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!isUserAuthenticated) {
    return null; // Or a redirecting message, but router.push should handle it
  }

  return (
    <MainLayout>
      <div className="py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Meus Veículos
          </h1>
          <button
            onClick={() => dispatch({ type: "SHOW_ADD_MODAL", payload: true })}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Adicionar Veículo
          </button>
        </div>

        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
          {state.ui.isLoadingVehicles ? (
            <div className="p-8">
              <Loading
                text="Carregando veículos..."
                size="medium"
                color="blue"
              />
            </div>
          ) : state.vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Nenhum veículo encontrado. Adicione seu primeiro veículo.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {state.vehicles.map((vehicle, index) => (
                <li key={index}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                          <p className="font-medium text-blue-600 truncate">
                            {vehicle?.modelo}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <p>Placa: {vehicle?.placa}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0 flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleAddMaintenanceClick(vehicle)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        title="Adicionar manutenção"
                      >
                        <WrenchScrewdriverIcon
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Editar veículo"
                      >
                        <PencilIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(vehicle)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        disabled={
                          state.deletion.isDeleting &&
                          state.deletion.deletingId === vehicle.id
                        }
                        title="Excluir veículo"
                      >
                        {state.deletion.isDeleting &&
                        state.deletion.deletingId === vehicle.id ? (
                          <LoadingSpinnerIcon className="animate-spin h-4 w-4 text-white" />
                        ) : (
                          <TrashIcon className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <AddVehicleModal
          isOpen={state.ui.showAddModal}
          isLoading={state.ui.isLoading}
          onClose={() => dispatch({ type: "SHOW_ADD_MODAL", payload: false })}
          onSubmit={handleAddVehicle}
        />

        <AddVehicleModal
          isOpen={state.ui.showAddModal}
          isLoading={state.ui.isLoading}
          onClose={() => dispatch({ type: "SHOW_ADD_MODAL", payload: false })}
          onSubmit={handleAddVehicle}
        />

        <DeleteVehicleModal
          isOpen={state.deletion.showConfirmModal}
          vehicle={state.deletion.vehicleToDelete}
          isLoading={state.deletion.isDeleting}
          onClose={() => dispatch({ type: "CANCEL_DELETE" })}
          onConfirm={handleDeleteVehicle}
        />

        {state.ui.showAddMaintenanceModal &&
          state.maintenance.selectedVehicle && (
            <AddMaintenanceModal
              isOpen={state.ui.showAddMaintenanceModal}
              isLoading={state.ui.isLoading}
              onClose={() => {
                dispatch({
                  type: "SHOW_ADD_MAINTENANCE_MODAL",
                  payload: false,
                });
                dispatch({ type: "SET_SELECTED_VEHICLE", payload: null });
              }}
              onSubmit={handleAddMaintenance}
              vehicle={state.maintenance.selectedVehicle}
            />
          )}
      </div>
    </MainLayout>
  );
}
