import React from "react";
import { Vehicle } from "@/domain/vehicle/types";
import Loading from "@/components/ui/Loading";

type DeleteVehicleModalProps = {
  isOpen: boolean;
  vehicle: Vehicle | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteVehicleModal({
  isOpen,
  vehicle,
  isLoading,
  onClose,
  onConfirm,
}: DeleteVehicleModalProps) {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900">
            Confirmar Exclusão
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Fechar"
          >
            <span className="sr-only">Fechar</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 mb-6">
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir o veículo{" "}
            <span className="font-semibold">{vehicle.modelo}</span>{" "}
            com placa{" "}
            <span className="font-semibold">{vehicle.placa}</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="border-t mt-6 pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <span className="-ml-1 mr-2">
                  <Loading size="small" color="white" />
                </span>
                <span>Excluindo...</span>
              </div>
            ) : (
              "Excluir Veículo"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
