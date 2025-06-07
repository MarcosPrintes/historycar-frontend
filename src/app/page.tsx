import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
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
};

export default HomePage;


