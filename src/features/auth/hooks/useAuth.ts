import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from './useAuthStore';
import { ApiClient } from '@/core/infrastructure/http/ApiClient';
import { AuthRepository } from '@/core/infrastructure/http/AuthRepository';
import { TokenStorage } from '@/core/infrastructure/storage/TokenStorage';
import { LoginUseCase } from '@/core/application/use-cases/LoginUseCase';
import { LogoutUseCase } from '@/core/application/use-cases/LogoutUseCase';
import { RefreshSessionUseCase } from '@/core/application/use-cases/RefreshSessionUseCase';
import { GetCurrentUserUseCase } from '@/core/application/use-cases/GetCurrentUserUseCase';
import { LoginDTO } from '@/core/application/dto/LoginDTO';
import { AuthError } from '@/core/domain/errors/AuthError';

export const useAuth = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, error, setUser, setLoading, setError, reset } = useAuthStore();
  
  // Referencias para evitar re-creaciones
  const apiClientRef = useRef<ApiClient>(null);
  const authRepositoryRef = useRef<AuthRepository>(null);
  const tokenStorageRef = useRef<TokenStorage>(null);
  const loginUseCaseRef = useRef<LoginUseCase>(null);
  const logoutUseCaseRef = useRef<LogoutUseCase>(null);
  const refreshUseCaseRef = useRef<RefreshSessionUseCase>(null);
  const getCurrentUserUseCaseRef = useRef<GetCurrentUserUseCase>(null);

  // Inicializar dependencias
  useEffect(() => {
    const handleSessionExpired = () => {
      reset();
      router.push('/auth/login');
    };

    const handleTokenExpiring = async () => {
      try {
        if (refreshUseCaseRef.current) {
          const user = await refreshUseCaseRef.current.execute();
          setUser(user);
        }
      } catch (error) {
        console.error('Error al refrescar sesión:', error);
        handleSessionExpired();
      }
    };

    // Crear instancias
    apiClientRef.current = new ApiClient(handleSessionExpired);
    authRepositoryRef.current = new AuthRepository(apiClientRef.current);
    tokenStorageRef.current = new TokenStorage(handleTokenExpiring);
    
    // Crear casos de uso
    loginUseCaseRef.current = new LoginUseCase(
      authRepositoryRef.current,
      tokenStorageRef.current
    );
    
    logoutUseCaseRef.current = new LogoutUseCase(
      authRepositoryRef.current,
      tokenStorageRef.current
    );
    
    refreshUseCaseRef.current = new RefreshSessionUseCase(
      authRepositoryRef.current,
      tokenStorageRef.current
    );
    
    getCurrentUserUseCaseRef.current = new GetCurrentUserUseCase(
      authRepositoryRef.current,
      tokenStorageRef.current
    );

    // Verificar sesión inicial
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    if (!getCurrentUserUseCaseRef.current || !tokenStorageRef.current) return;

    setLoading(true);
    try {
      // Verificar si hay flag de autenticación
      if (tokenStorageRef.current.isAuthenticated()) {
        const user = await getCurrentUserUseCaseRef.current.execute();
        setUser(user);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      reset();
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, reset]);

  const login = useCallback(async (credentials: LoginDTO) => {
    if (!loginUseCaseRef.current) return;

    setLoading(true);
    setError(null);
    
    try {
      const user = await loginUseCaseRef.current.execute(credentials);
      setUser(user);
      router.push('/dashboard');
      return { success: true };
    } catch (error: any) {
      const message = error instanceof AuthError 
        ? error.message 
        : 'Error al iniciar sesión';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [router, setUser, setLoading, setError]);

  const logout = useCallback(async () => {
    if (!logoutUseCaseRef.current) return;

    setLoading(true);
    try {
      await logoutUseCaseRef.current.execute();
      reset();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Limpiar estado local aunque falle el backend
      reset();
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router, reset, setLoading]);

  const refresh = useCallback(async () => {
    if (!refreshUseCaseRef.current) return;

    try {
      const user = await refreshUseCaseRef.current.execute();
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Error refrescando sesión:', error);
      reset();
      return { success: false };
    }
  }, [setUser, reset]);

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Acciones
    login,
    logout,
    refresh,
    checkAuth,
    
    // Utilidades
    isAdmin: user?.isAdmin() ?? false,
    isStaff: user?.isStaff() ?? false,
  };
};
