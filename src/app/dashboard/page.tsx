"use client";

import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import {
  ArrowUpIcon,
  WrenchIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  // Mock data - in a real app, this would come from the API
  const mockStats = [
    {
      name: "Total Vehicles",
      value: "4",
      icon: <ArrowUpIcon className="h-6 w-6 text-blue-500" />,
    },
    {
      name: "Maintenance Records",
      value: "12",
      icon: <WrenchIcon className="h-6 w-6 text-green-500" />,
    },
    {
      name: "Upcoming Services",
      value: "2",
      icon: <ClockIcon className="h-6 w-6 text-amber-500" />,
    },
  ];

  const recentMaintenance = [
    {
      id: 1,
      vehicle: "Toyota Corolla",
      service: "Oil Change",
      date: "2025-05-20",
      cost: "$45.00",
    },
    {
      id: 2,
      vehicle: "Honda Civic",
      service: "Tire Rotation",
      date: "2025-05-18",
      cost: "$25.00",
    },
    {
      id: 3,
      vehicle: "Ford F-150",
      service: "Brake Inspection",
      date: "2025-05-15",
      cost: "$75.00",
    },
  ];

  return (
    <MainLayout>
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mockStats.map((stat) => (
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
                {recentMaintenance.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.vehicle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.cost}
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
