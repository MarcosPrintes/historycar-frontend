import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Vehicle } from "@/domain/vehicle/types";
import { CreateMaintenanceData } from "@/domain/maintenance/types";
import { HeaderActionIcon, CloseIcon, CheckIcon, LoadingSpinnerIcon } from "@/components/ui/Icons";

const maintenanceSchema = z.object({
  serviceType: z.string().min(1, "Tipo de serviço é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  cost: z.string().min(1, "Valor é obrigatório"),
  mileage: z.string().optional(), // Odometer reading, will be converted to number
  placeName: z.string().min(1, "Local do serviço é obrigatório"),
  mechanicName: z.string().min(1, "Nome do mecânico é obrigatório"),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

type AddMaintenanceModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMaintenanceData) => Promise<void>;
  vehicle: Vehicle; // The vehicle for which maintenance is being added
};

export default function AddMaintenanceModal({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
  vehicle,
}: AddMaintenanceModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      serviceType: "",
      description: "",
      date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      cost: "",
      mileage: "",
      placeName: "",
      mechanicName: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: MaintenanceFormData) => {
    const payload: CreateMaintenanceData = {
      carFkId: vehicle.id, // From vehicle prop
      serviceType: data.serviceType,
      description: data.description,
      date: data.date,
      cost: parseFloat(data.cost),
      mileage: data.mileage ? parseInt(data.mileage) : 0, // Odometer reading
      placeName: data.placeName,
      mechanicName: data.mechanicName,
    };

    await onSubmit(payload);

    // Reset form after successful submission
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-0 overflow-hidden animate-fadeIn">
        {/* Cabeçalho do modal */}
        <div className="bg-green-600 py-4 px-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <HeaderActionIcon />
            {`Manutenção para ${vehicle.modelo}`}
          </h3>
        </div>

        {/* Corpo do formulário */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            {`Registre uma manutenção para o veículo ${vehicle.placa}.`}
          </p>

          <form className="space-y-5" onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Tipo de Serviço */}
              <div>
                <label
                  htmlFor="serviceType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tipo de Serviço *
                </label>
                <input
                  type="text"
                  id="serviceType"
                  className={`block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 placeholder-gray-600 ${
                    errors.serviceType
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500 text-gray-800"
                  }`}
                  placeholder="Ex: Troca de óleo"
                  {...register("serviceType")}
                />
                {errors.serviceType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.serviceType.message}
                  </p>
                )}
              </div>

              {/* Data */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data *
                </label>
                <input
                  type="date"
                  id="date"
                  className={`block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 ${
                    errors.date
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500 text-gray-800"
                  }`}
                  {...register("date")}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Valor */}
              <div>
                <label
                  htmlFor="cost"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Valor (R$) *
                </label>
                <input
                  type="text"
                  id="cost"
                  className={`block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 placeholder-gray-600 ${
                    errors.cost
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500 text-gray-800"
                  }`}
                  placeholder="0.00"
                  {...register("cost")}
                />
                {errors.cost && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.cost.message}
                  </p>
                )}
              </div>

              {/* Quilometragem */}
              <div>
                <label
                  htmlFor="mileage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quilometragem (km) - Opcional
                </label>
                <input
                  type="text"
                  id="mileage"
                  className="block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 placeholder-gray-600 border-gray-300 focus:border-green-500 focus:ring-green-500 text-gray-800"
                  placeholder="0.0"
                  {...register("mileage")}
                />
              </div>

              {/* Local do Serviço */}
              <div>
                <label
                  htmlFor="placeName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Local do Serviço *
                </label>
                <input
                  type="text"
                  id="placeName"
                  className={`block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 placeholder-gray-600 ${
                    errors.placeName
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500 text-gray-800"
                  }`}
                  placeholder="Ex: Oficina do João"
                  {...register("placeName")}
                />
                {errors.placeName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.placeName.message}
                  </p>
                )}
              </div>

              {/* Nome do Mecânico */}
              <div>
                <label
                  htmlFor="mechanicName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome do Mecânico *
                </label>
                <input
                  type="text"
                  id="mechanicName"
                  className={`block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 placeholder-gray-600 ${
                    errors.mechanicName
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500 text-gray-800"
                  }`}
                  placeholder="Digite aqui..."
                  {...register("mechanicName")}
                />
                {errors.mechanicName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.mechanicName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição *
              </label>
              <textarea
                id="description"
                rows={3}
                className={`block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 placeholder-gray-600 ${
                  errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500 text-gray-800"
                }`}
                placeholder="Detalhes da manutenção..."
                {...register("description")}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
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
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                disabled={isLoading}
              >
                <CloseIcon />
                Cancelar
              </button>
              <button
                type="submit"
                className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${ // Added justify-center for spinner alignment
                  isLoading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinnerIcon className="h-5 w-5 text-white" /> // Adjusted class for spinner only
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5 mr-2" />
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
