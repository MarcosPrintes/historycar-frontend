"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import MainLayout from "@/components/layouts/MainLayout";
import {
  ArrowUpIcon,
  WrenchIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import AuthService from '@/lib/api/authService';
import { LoadingSpinnerIcon } from '@/components/ui/Icons'; // Assuming this path is correct
import MaintenanceService from "@/lib/api/maintenanceService";
import { MaintenanceRecord } from "@/domain/maintenance/types";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [totalVehiclesCount, setTotalVehiclesCount] = useState<number | string>("-");
  const [maintenanceRecordsCount, setMaintenanceRecordsCount] = useState<number | string>("-");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentMaintenanceData, setRecentMaintenanceData] = useState<MaintenanceRecord[]>([]);

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isUserAuthenticated) return; // Don't fetch if not authenticated
      setIsDataLoading(true);
      setError(null);
      try {
        const response = await MaintenanceService.getMaintenanceRecords();
        if (response.success && response.data) {
          const records: MaintenanceRecord[] = response.data;
          setMaintenanceRecordsCount(records.length);
          
          const uniqueVehicleIds = new Set(records.map(record => record.carFkId));
          setTotalVehiclesCount(uniqueVehicleIds.size);

          // Sort records by date (most recent first) and take top 5
          const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setRecentMaintenanceData(sortedRecords.slice(0, 5));
        } else {
          setError(response.message || "Falha ao carregar dados do dashboard.");
          setTotalVehiclesCount("Err");
          setMaintenanceRecordsCount("Err");
        }
      } catch (err) {
        setError("Erro ao conectar com o servidor.");
        setTotalVehiclesCount("Err");
        setMaintenanceRecordsCount("Err");
        console.error("Dashboard fetch error:", err);
      }
      setIsDataLoading(false);
    };

    fetchDashboardData();
  }, [isUserAuthenticated]); // Added isUserAuthenticated
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinnerIcon className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!isUserAuthenticated) {
    // Should be redirected, but as a fallback, render null or a message
    return null; 
  }

  // Stats will be updated by useEffect
  const stats = [
    {
      name: "Total Vehicles",
      value: isDataLoading ? "..." : String(totalVehiclesCount),
      icon: <ArrowUpIcon className="h-6 w-6 text-blue-500" />,
    },
    {
      name: "Maintenance Records",
      value: isDataLoading ? "..." : String(maintenanceRecordsCount),
      icon: <WrenchIcon className="h-6 w-6 text-green-500" />,
    },
    {
      name: "Upcoming Services",
      value: "2",
      icon: <ClockIcon className="h-6 w-6 text-amber-500" />,
    },
  ];

  // const recentMaintenance = [ // This will be replaced by recentMaintenanceData from state


  return (
    <MainLayout>
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                {isDataLoading && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-sm text-gray-500">Carregando manutenções recentes...</td>
                  </tr>
                )}
                {!isDataLoading && error && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-sm text-red-500">Falha ao carregar manutenções: {error}</td>
                  </tr>
                )}
                {!isDataLoading && !error && recentMaintenanceData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-sm text-gray-500">Nenhuma manutenção recente encontrada.</td>
                  </tr>
                )}
                {!isDataLoading && !error && recentMaintenanceData.map((record) => (
                  <tr key={record.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {record.modelo || 'N/A'} ({record.placa || 'N/A'})
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {record.serviceType}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {record.date || 'N/A'}
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
