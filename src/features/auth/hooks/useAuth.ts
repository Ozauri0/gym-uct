import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        // Verificar si el token no ha expirado (opcional)
        if (isTokenValid(token)) {
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
          return;
        }
      }
      
      // Si no hay token válido, limpiar estado
      clearAuthData();
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      clearAuthData();
    }
  };

  const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const login = (userData: User, tokens: { accessToken: string; refreshToken: string }) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    setAuthState({
      user: userData,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    clearAuthData();
    router.push('/auth/login');
  };

  const redirectToAuth = () => {
    router.push('/auth/login');
  };

  const redirectToHome = () => {
    router.push('/');
  };

  return {
    ...authState,
    login,
    logout,
    redirectToAuth,
    redirectToHome,
    checkAuthStatus,
  };
};
