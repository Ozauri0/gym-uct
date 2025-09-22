'use client';

import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = requiere estar logueado, false = requiere NO estar logueado
  fallbackPath?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  fallbackPath 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, redirectToAuth, redirectToHome } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // Ruta protegida: usuario no autenticado -> redirigir al login
        redirectToAuth();
      } else if (!requireAuth && isAuthenticated) {
        // Ruta pública (como login): usuario autenticado -> redirigir al home
        if (fallbackPath) {
          window.location.href = fallbackPath;
        } else {
          redirectToHome();
        }
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectToAuth, redirectToHome, fallbackPath]);

  // Mostrar loading mientras se verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Verificando autenticación...</span>
      </div>
    );
  }

  // Mostrar contenido solo si cumple con los requisitos de autenticación
  if (requireAuth && !isAuthenticated) {
    return null; // No mostrar nada, se redirigirá
  }

  if (!requireAuth && isAuthenticated) {
    return null; // No mostrar nada, se redirigirá
  }

  return <>{children}</>;
};
