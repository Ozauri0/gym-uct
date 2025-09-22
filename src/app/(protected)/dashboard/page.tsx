'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar Sesión
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Información del Usuario</h2>
            <div className="space-y-2">
              <p><strong>Nombre:</strong> {user?.nombre}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Rol:</strong> {user?.role}</p>
              <p><strong>Estado:</strong> {user?.isActive ? 'Activo' : 'Inactivo'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
