"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import AuthService from "@/lib/api/authService";

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Vehicles", href: "/vehicles" },
  { name: "Maintenance", href: "/maintenance" },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    AuthService.logout();
    toast.success("Logout realizado com sucesso");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link
                  href="/dashboard"
                  className="text-xl font-bold text-blue-600"
                >
                  HistoryCar
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const isCurrent = pathname === item.href;
                  let classNames = "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium";
                  if (isCurrent) {
                    classNames += " border-blue-500 text-gray-700";
                  } else {
                    classNames += " border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700";
                  }
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Botão de Logout - Visível apenas em telas maiores */}
            <div className="hidden sm:flex sm:items-center">
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition ease-in-out duration-150"
              >
                <span className="mr-1">
                  <ArrowRightCircleIcon className="h-5 w-5" />
                </span>
                Sair
              </button>
            </div>

            <div className="-mr-2 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu, show/hide based on menu state. */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => {
                  const isCurrent = pathname === item.href;
                  let classNames = "block border-l-4 py-2 pl-3 pr-4 text-base font-medium";
                  if (isCurrent) {
                    classNames += " border-blue-500 bg-gray-50 text-gray-700";
                  } else {
                    classNames += " border-transparent text-gray-500 hover:border-blue-500 hover:bg-gray-50 hover:text-gray-700";
                  }
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames}
                    >
                      {item.name}
                    </Link>
                  );
                })}

              {/* Botão de Logout no menu móvel */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-blue-500 hover:bg-gray-50 hover:text-gray-700"
              >
                <span className="mr-2">
                  <ArrowRightCircleIcon className="h-5 w-5" />
                </span>
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
