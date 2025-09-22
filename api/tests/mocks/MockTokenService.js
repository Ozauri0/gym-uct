const TokenService = require('../../src/domain/ports/TokenService');

/**
 * MockTokenService
 * Implementación mock del TokenService para testing
 */
class MockTokenService extends TokenService {
  constructor() {
    super();
    this.tokenCounter = 1;
  }

  async generateAccessToken(payload, expiresIn = '15m') {
    // Generar token mock con el payload embebido
    const token = `access_token_${this.tokenCounter++}_${Buffer.from(JSON.stringify(payload)).toString('base64')}`;
    return token;
  }

  async generateRefreshToken() {
    return `refresh_token_${this.tokenCounter++}`;
  }

  async verifyAccessToken(token) {
    // Extraer payload del token mock
    if (!token.startsWith('access_token_')) {
      throw new Error('Invalid token format');
    }

    const parts = token.split('_');
    if (parts.length < 4) {
      throw new Error('Invalid token structure');
    }

    try {
      const encodedPayload = parts.slice(3).join('_');
      const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString());
      return payload;
    } catch (error) {
      throw new Error('Failed to decode token payload');
    }
  }

  async verifyRefreshToken(refreshToken) {
    // Verificar formato básico del refresh token mock
    return refreshToken && refreshToken.startsWith('refresh_token_');
  }

  // Métodos de utilidad para testing
  reset() {
    this.tokenCounter = 1;
  }
}

module.exports = MockTokenService;
