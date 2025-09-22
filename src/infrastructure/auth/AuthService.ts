/**
 * AuthService - Servicio de autenticación que conecta frontend con backend hexagonal
 * Mantiene clean code y actúa como adaptador entre frontend y API backend
 */

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  rut?: string;
  carrera?: string;
  password: string;
  role?: string;
}

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
  error?: string;
}

export class AuthService {
  private readonly apiBaseUrl: string;

  constructor() {
    // Configurar URL base de la API backend
    this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
  }

  /**
   * Registra un nuevo usuario usando el backend hexagonal
   */
  async register(data: RegisterData): Promise<AuthResult> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role || 'alumno'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Error en el registro'
        };
      }

      return {
        success: true,
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
          role: result.role || 'alumno'
        }
      };

    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }

  /**
   * Autentica un usuario usando el backend hexagonal
   */
  async login(data: LoginData): Promise<AuthResult> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Credenciales incorrectas'
        };
      }

      return {
        success: true,
        user: {
          id: result.user?.id || '',
          email: result.user?.email || data.email,
          name: result.user?.name || '',
          role: result.user?.role || 'alumno'
        },
        tokens: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken || '',
          expiresIn: result.expiresIn || '15m'
        }
      };

    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor'
      };
    }
  }
}
