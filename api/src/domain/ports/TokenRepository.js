/**
 * TokenRepository Port
 * Define el contrato para la gestión de tokens de refresh
 */
class TokenRepository {
  /**
   * Guarda un refresh token
   * @param {string} userId 
   * @param {string} refreshToken 
   * @param {Date} expiresAt 
   * @returns {Promise<void>}
   */
  async saveRefreshToken(userId, refreshToken, expiresAt) {
    throw new Error('Method saveRefreshToken must be implemented');
  }

  /**
   * Busca un refresh token válido
   * @param {string} refreshToken 
   * @returns {Promise<{userId: string, expiresAt: Date}|null>}
   */
  async findRefreshToken(refreshToken) {
    throw new Error('Method findRefreshToken must be implemented');
  }

  /**
   * Revoca un refresh token específico
   * @param {string} refreshToken 
   * @returns {Promise<void>}
   */
  async revokeRefreshToken(refreshToken) {
    throw new Error('Method revokeRefreshToken must be implemented');
  }

  /**
   * Revoca todos los refresh tokens de un usuario
   * @param {string} userId 
   * @returns {Promise<void>}
   */
  async revokeAllUserTokens(userId) {
    throw new Error('Method revokeAllUserTokens must be implemented');
  }

  /**
   * Limpia tokens expirados
   * @returns {Promise<number>} Número de tokens eliminados
   */
  async cleanExpiredTokens() {
    throw new Error('Method cleanExpiredTokens must be implemented');
  }
}

module.exports = TokenRepository;
