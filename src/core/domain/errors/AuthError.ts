export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'AuthError';
  }

  static invalidCredentials(): AuthError {
    return new AuthError(
      'Credenciales inválidas',
      'INVALID_CREDENTIALS',
      401
    );
  }

  static sessionExpired(): AuthError {
    return new AuthError(
      'Tu sesión ha expirado',
      'SESSION_EXPIRED',
      401
    );
  }

  static networkError(): AuthError {
    return new AuthError(
      'Error de conexión',
      'NETWORK_ERROR'
    );
  }

  static accountLocked(): AuthError {
    return new AuthError(
      'Cuenta bloqueada por múltiples intentos fallidos',
      'ACCOUNT_LOCKED',
      423
    );
  }
}