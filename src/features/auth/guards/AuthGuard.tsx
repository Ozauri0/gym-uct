'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'alumno' | 'staff' | 'admin';
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  requiredRole,
  redirectTo = '/auth/login' 
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }

    if (requiredRole && user && !hasRequiredRole(user.role, requiredRole)) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user && !hasRequiredRole(user.role, requiredRole)) {
    return null;
  }

  return <>{children}</>;
}

function hasRequiredRole(
  userRole: 'alumno' | 'staff' | 'admin',
  requiredRole: 'alumno' | 'staff' | 'admin'
): boolean {
  const roleHierarchy = {
    alumno: 0,
    staff: 1,
    admin: 2,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
