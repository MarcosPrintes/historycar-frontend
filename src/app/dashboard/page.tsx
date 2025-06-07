"use client";

import React, { useEffect, useReducer } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { ArrowUpIcon, WrenchIcon } from "@heroicons/react/24/outline";
import MaintenanceService from "@/lib/api/maintenanceService";
import { MaintenanceRecord } from "@/domain/maintenance/types";

// State and Reducer definitions
interface DashboardState {
  totalVehiclesCount: number | string;
  maintenanceRecordsCount: number | string;
  recentMaintenanceData: MaintenanceRecord[]; // This will store the original, unfiltered list
  isDataLoading: boolean;
  error: string | null;
  searchTerm: string;
}

type DashboardAction =
  | { type: "FETCH_INIT" }
  | {
      type: "FETCH_SUCCESS";
      payload: {
        totalVehicles: number;
        totalMaintenance: number;
        recentRecords: MaintenanceRecord[];
      };
    }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "SET_SEARCH_TERM"; payload: string };

const initialState: DashboardState = {
  totalVehiclesCount: "-",
  maintenanceRecordsCount: "-",
  recentMaintenanceData: [],
  isDataLoading: true,
  error: null,
  searchTerm: "",
};

function dashboardReducer(
  state: DashboardState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isDataLoading: true,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isDataLoading: false,
        totalVehiclesCount: action.payload.totalVehicles,
        maintenanceRecordsCount: action.payload.totalMaintenance,
        recentMaintenanceData: action.payload.recentRecords,
        error: null,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isDataLoading: false,
        error: action.payload,
        totalVehiclesCount: "Err",
        maintenanceRecordsCount: "Err",
        recentMaintenanceData: [],
      };
    case "SET_SEARCH_TERM":
      return {
        ...state,
        searchTerm: action.payload,
      };
    default:
      return state;
  }
}

export default function DashboardPage() {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  useEffect(() => {
    const fetchDashboardData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const response = await MaintenanceService.getMaintenanceRecords();
        if (response.success && response.data) {
          const records: MaintenanceRecord[] = response.data;
          const uniqueVehicleIds = new Set(
            records.map((record) => record.carFkId)
          );
          const sortedRecords = [...records]
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 5);

          dispatch({
            type: "FETCH_SUCCESS",
            payload: {
              totalVehicles: uniqueVehicleIds.size,
              totalMaintenance: records.length,
              recentRecords: sortedRecords,
            },
          });
        } else {
          dispatch({
            type: "FETCH_FAILURE",
            payload:
              response.message || "Falha ao carregar dados do dashboard.",
          });
        }
      } catch (err) {
        dispatch({
          type: "FETCH_FAILURE",
          payload: "Erro ao conectar com o servidor.",
        });
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  // Stats will be updated by useEffect
  const stats = [
    {
      name: "Total Vehicles",
      value: state.isDataLoading ? "..." : String(state.totalVehiclesCount),
      icon: <ArrowUpIcon className="h-6 w-6 text-blue-500" />,
    },
    {
      name: "Maintenance Records",
      value: state.isDataLoading
        ? "..."
        : String(state.maintenanceRecordsCount),
      icon: <WrenchIcon className="h-6 w-6 text-green-500" />,
    },
    // {
    //   name: "Upcoming Services",
    //   value: "2",
    //   icon: <ClockIcon className="h-6 w-6 text-amber-500" />,
    // },
  ];

  // const recentMaintenance = [ // This will be replaced by recentMaintenanceData from state

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value });
  };

  const filteredRecords = state.recentMaintenanceData.filter(record => {
    const term = state.searchTerm.toLowerCase();
    const modelMatch = record.modelo?.toLowerCase().includes(term) ?? false;
    const serviceMatch = record.serviceType?.toLowerCase().includes(term) ?? false;
    // If search term is empty, show all records
    if (term === "") return true;
    return modelMatch || serviceMatch;
  });

  return (
    <MainLayout>
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">{stat.icon}</div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="truncate text-sm font-medium text-gray-500">
                    {stat.name}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Input */}
        <div className="mt-8">
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium leading-6 text-gray-900">
              Filtrar por Modelo ou Serviço
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="searchTerm"
                id="searchTerm"
                value={state.searchTerm}
                onChange={handleSearchTermChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder="Digite o modelo ou tipo de serviço"
              />
            </div>
          </div>
        </div>

        {/* Recent Maintenance */}
        <h2 className="mt-8 text-lg font-medium text-gray-900">
          Recent Maintenance
        </h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.isDataLoading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-4 text-sm text-gray-500"
                    >
                      Carregando manutenções recentes...
                    </td>
                  </tr>
                )}
                {!state.isDataLoading && state.error && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-4 text-sm text-red-500"
                    >
                      Falha ao carregar manutenções: {state.error}
                    </td>
                  </tr>
                )}
                {!state.isDataLoading &&
                  !state.error &&
                  filteredRecords.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-4 text-sm text-gray-500"
                      >
                        Nenhuma manutenção recente encontrada.
                      </td>
                    </tr>
                  )}
                {!state.isDataLoading &&
                  !state.error &&
                  filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {record.modelo || "N/A"} ({record.placa || "N/A"})
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {record.serviceType}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {record.date || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        R$ {record.cost.toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Add New Maintenance Record
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
