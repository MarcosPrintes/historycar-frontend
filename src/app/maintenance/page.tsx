"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import MaintenanceService from "@/lib/api/maintenanceService";
import { MaintenanceRecord } from "@/domain/maintenance/types";
import { TrashIcon } from '@heroicons/react/24/outline';
import { LoadingSpinnerIcon } from '@/components/ui/Icons';
import { toast } from "react-toastify";

const MaintenancePage: React.FC = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    MaintenanceRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (recordId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este registro de manutenção?")) {
      return;
    }
    setDeletingId(recordId);
    try {
      const response = await MaintenanceService.deleteMaintenanceRecord(recordId);
      if (response.success) {
        setMaintenanceRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
        toast.success(response.message || "Registro excluído com sucesso!");
      } else {
        toast.error(response.message || "Falha ao excluir registro.");
      }
    } catch (err) {
      toast.error("Erro ao conectar com o servidor para excluir.");
      console.error("Delete error:", err);
    }
    setDeletingId(null);
  };

  useEffect(() => {
    const fetchMaintenanceRecords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await MaintenanceService.getMaintenanceRecords();
        if (response.success && response.data) {
          setMaintenanceRecords(response.data);
        } else {
          setError(
            response.message || "Falha ao carregar registros de manutenção."
          );
          toast.error(
            response.message || "Falha ao carregar registros de manutenção."
          );
        }
      } catch (err) {
        setError(
          "Erro ao conectar com o servidor. Tente novamente mais tarde."
        );
        toast.error(
          "Erro ao conectar com o servidor. Tente novamente mais tarde."
        );
        console.error(err);
      }
      setIsLoading(false);
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
          {isLoading && (
            <p className="text-gray-700">Carregando registros...</p>
          )}
          {error && <p className="text-red-500">Erro: {error}</p>}
          {!isLoading && !error && (
            <>
              {maintenanceRecords.length === 0 ? (
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
                      {maintenanceRecords.map((record) => (
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
                              disabled={deletingId === record.id}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50 p-1 rounded-full hover:bg-red-100 transition-colors"
                              title="Excluir manutenção"
                            >
                              {deletingId === record.id ? (
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
