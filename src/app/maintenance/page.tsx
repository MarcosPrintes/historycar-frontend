"use client";

import React, { useEffect, useReducer } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import MaintenanceService from "@/lib/api/maintenanceService";
import { MaintenanceRecord } from "@/domain/maintenance/types";
import { TrashIcon } from '@heroicons/react/24/outline';
import { LoadingSpinnerIcon } from '@/components/ui/Icons'; // Keep for delete button if still used, or remove if not.
import { toast } from "react-toastify";

// State and Reducer definitions
interface MaintenancePageState {
  maintenanceRecords: MaintenanceRecord[];
  isDataLoading: boolean;
  error: string | null;
  deletingId: string | null;
}

type MaintenancePageAction =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: MaintenanceRecord[] }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'DELETE_START'; payload: string } // recordId
  | { type: 'DELETE_SUCCESS'; payload: string } // recordId
  | { type: 'DELETE_FAILURE'; payload?: string } // Optional error message for delete
  | { type: 'RESET_ERROR' };

const initialState: MaintenancePageState = {
  maintenanceRecords: [],
  isDataLoading: true,
  error: null,
  deletingId: null,
};

function maintenancePageReducer(state: MaintenancePageState, action: MaintenancePageAction): MaintenancePageState {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isDataLoading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isDataLoading: false,
        maintenanceRecords: action.payload,
        error: null,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isDataLoading: false,
        error: action.payload,
      };
    case 'DELETE_START':
      return {
        ...state,
        deletingId: action.payload,
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        maintenanceRecords: state.maintenanceRecords.filter(record => record.id !== action.payload),
        deletingId: null,
      };
    case 'DELETE_FAILURE':
      // toast.error(action.payload || "Falha ao excluir registro."); // Toast handled in component
      return {
        ...state,
        deletingId: null,
      };
    case 'RESET_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      // Consider throwing an error for unhandled actions in development
      return state;
  }
}

const MaintenancePage: React.FC = () => {
  const [state, dispatch] = useReducer(maintenancePageReducer, initialState);

  const handleDelete = async (recordId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este registro de manutenção?")) {
      return;
    }
    dispatch({ type: 'DELETE_START', payload: recordId });
    try {
      const response = await MaintenanceService.deleteMaintenanceRecord(recordId);
      if (response.success) {
        dispatch({ type: 'DELETE_SUCCESS', payload: recordId });
        toast.success(response.message || "Registro excluído com sucesso!");
      } else {
        dispatch({ type: 'DELETE_FAILURE' });
        toast.error(response.message || "Falha ao excluir registro.");
      }
    } catch (err) {
      dispatch({ type: 'DELETE_FAILURE' });
      toast.error("Erro ao conectar com o servidor para excluir.");
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    const fetchMaintenanceRecords = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        const response = await MaintenanceService.getMaintenanceRecords();
        if (response.success && response.data) {
          dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
        } else {
          const errorMessage = response.message || "Falha ao carregar registros de manutenção.";
          dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
          toast.error(errorMessage);
        }
      } catch (err) {
        const errorMessage = "Erro ao conectar com o servidor. Tente novamente mais tarde.";
        dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
        toast.error(errorMessage);
        console.error(err);
      }
    };

    fetchMaintenanceRecords();
  }, []);

  return (
    <MainLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-8">
          {" "}
          {/* Added mb-8 for spacing below header, similar to original */}
          <div>
            {" "}
            {/* Wrapper for title and subtitle */}
            <h1 className="text-2xl font-semibold text-gray-900">
              Registros de Manutenção
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {" "}
              {/* Adjusted styling for subtitle */}
              Visualize e gerencie o histórico de manutenções dos seus veículos.
            </p>
          </div>
          {/* Placeholder for a potential button on the right, like 'Add Maintenance' */}
        </div>

        {/* Maintenance content area */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {state.isDataLoading && (
            <p className="text-gray-700">Carregando registros...</p>
          )}
          {state.error && <p className="text-red-500">Erro: {state.error}</p>}
          {!state.isDataLoading && !state.error && (
            <>
              {state.maintenanceRecords.length === 0 ? (
                <p className="text-gray-700">
                  Nenhum registro de manutenção encontrado.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veículo (Modelo)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Serviço</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Custo (R$)</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Odômetro (km)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mecânico</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {state.maintenanceRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.modelo || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.placa || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.serviceType}</td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs break-words">{record.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{record.cost.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{record.odometer}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.mechanicName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            <button
                              onClick={() => handleDelete(record.id)}
                              disabled={state.deletingId === record.id}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50 p-1 rounded-full hover:bg-red-100 transition-colors"
                              title="Excluir manutenção"
                            >
                              {state.deletingId === record.id ? (
                                <LoadingSpinnerIcon className="h-5 w-5 animate-spin" />
                              ) : (
                                <TrashIcon className="h-5 w-5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MaintenancePage;
