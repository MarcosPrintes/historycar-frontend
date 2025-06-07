import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateVehicleData } from "@/domain/vehicle/types";
import Loading from "@/components/ui/Loading";

const vehicleSchema = z.object({
  modelo: z.string().min(1, "Modelo é obrigatório"),
  placa: z.string().min(1, "Placa é obrigatória"),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

type AddVehicleModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVehicleData) => Promise<void>;
};
  
export default function AddVehicleModal({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}: AddVehicleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      modelo: "",
      placa: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: VehicleFormData) => {
    await onSubmit({
      modelo: data.modelo,
      placa: data.placa,
    });
    
    // Reset form after successful submission
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-0 overflow-hidden animate-fadeIn">
        {/* Cabeçalho do modal */}
        <div className="bg-blue-600 py-4 px-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Novo Veículo
          </h3>
        </div>
        
        {/* Corpo do formulário */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Preencha os dados do veículo para cadastrá-lo no sistema.
          </p>
          
          <form 
            className="space-y-5" 
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Modelo */}
              <div>
                <label
                  htmlFor="modelo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Modelo *
                </label>
                <input
                  type="text"
                  id="modelo"
                  className={`block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 placeholder-gray-600 ${
                    errors.modelo
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  }`}
                  placeholder="Ex: Corolla"
                  {...register("modelo")}
                />
                {errors.modelo && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.modelo.message}
                  </p>
                )}
              </div>

              {/* Placa */}
              <div>
                <label
                  htmlFor="placa"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Placa *
                </label>
                <input
                  type="text"
                  id="placa"
                  className={`block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 placeholder-gray-600 ${
                    errors.placa
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  }`}
                  placeholder="Ex: ABC-1234"
                  {...register("placa")}
                />
                {errors.placa && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.placa.message}
                  </p>
                )}
              </div>
            </div>

            {/* Aviso de campos obrigatórios */}
            <div className="text-xs text-gray-500 italic">
              * Campos obrigatórios
            </div>
            
            {/* Botões de ação */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
              <button
                type="submit"
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <span className="-ml-1 mr-2">
                      <Loading size="small" color="white" />
                    </span>
                    <span>Salvando...</span>
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Salvar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
