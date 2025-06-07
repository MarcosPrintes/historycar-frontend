"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthService from '@/lib/api/authService';
import { LoadingSpinnerIcon } from '@/components/ui/Icons'; // Assuming you have this

const RootPage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await AuthService.isAuthenticated();
      if (authStatus) {
        router.push('/dashboard');
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [router]);

  if (isLoading || isAuthenticated === true) { // Show loading or let redirect happen
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinnerIcon className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  // If not loading and not authenticated, show the Home Page content
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              HistoryCar
            </Link>
            <div className="space-x-4">
              <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition">
                Login
            </Link>
              <Link href="/auth/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
                Cadastrar
            </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Bem-vindo ao HistoryCar!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Gerencie o histórico de manutenção dos seus veículos de forma fácil e eficiente. Mantenha tudo organizado e acessível em um só lugar.
          </p>
          <div>
            <Link href="/auth/register" className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
              Comece Agora Gratuitamente
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white py-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} HistoryCar. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    );
  }

  return null; // Should be covered by loading or redirect
};

export default RootPage;

