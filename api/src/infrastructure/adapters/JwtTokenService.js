const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const TokenService = require('../../domain/ports/TokenService');

/**
 * JwtTokenService Adapter
 * Implementa el port TokenService usando JWT
 */
class JwtTokenService extends TokenService {
  constructor({ accessTokenSecret, refreshTokenSecret }) {
    super();
    if (!accessTokenSecret || !refreshTokenSecret) {
      throw new Error('Both access and refresh token secrets are required');
    }
    this.accessTokenSecret = accessTokenSecret;
    this.refreshTokenSecret = refreshTokenSecret;
  }

  /**
   * Genera un access token JWT
   * @param {Object} payload 
   * @param {string} expiresIn 
   * @returns {Promise<string>}
   */
  async generateAccessToken(payload, expiresIn = '15m') {
    try {
      return jwt.sign(payload, this.accessTokenSecret, {
        expiresIn,
        issuer: 'gym-uct',
        audience: 'gym-uct-users'
      });
    } catch (error) {
      throw new Error(`Failed to generate access token: ${error.message}`);
    }
  }

  /**
   * Genera un refresh token seguro
   * @returns {Promise<string>}
   */
  async generateRefreshToken() {
    try {
      // Generar token aleatorio de 64 bytes en base64url
      const randomBytes = crypto.randomBytes(64);
      return randomBytes.toString('base64url');
    } catch (error) {
      throw new Error(`Failed to generate refresh token: ${error.message}`);
    }
  }

  /**
   * Verifica y decodifica un access token
   * @param {string} token 
   * @returns {Promise<Object>}
   */
  async verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret, {
        issuer: 'gym-uct',
        audience: 'gym-uct-users'
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid access token');
      }
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  /**
   * Verifica un refresh token (formato válido)
   * @param {string} refreshToken 
   * @returns {Promise<boolean>}
   */
  async verifyRefreshToken(refreshToken) {
    try {
      // Verificar que es una string base64url válida de 64 bytes
      if (!refreshToken || typeof refreshToken !== 'string') {
        return false;
      }

      // Verificar longitud aproximada (64 bytes en base64url ≈ 86 caracteres)
      if (refreshToken.length !== 86) {
        return false;
      }

      // Verificar que solo contiene caracteres base64url válidos
      const base64urlRegex = /^[A-Za-z0-9_-]+$/;
      if (!base64urlRegex.test(refreshToken)) {
        return false;
      }

      // Intentar decodificar
      Buffer.from(refreshToken, 'base64url');
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = JwtTokenService;
