/**
 * TokenService Port
 * Define el contrato para la generación y validación de JWT tokens
 */
class TokenService {
  /**
   * Genera un access token JWT
   * @param {Object} payload 
   * @param {string} expiresIn 
   * @returns {Promise<string>}
   */
  async generateAccessToken(payload, expiresIn = '15m') {
    throw new Error('Method generateAccessToken must be implemented');
  }

  /**
   * Genera un refresh token
   * @returns {Promise<string>}
   */
  async generateRefreshToken() {
    throw new Error('Method generateRefreshToken must be implemented');
  }

  /**
   * Verifica y decodifica un access token
   * @param {string} token 
   * @returns {Promise<Object>}
   */
  async verifyAccessToken(token) {
    throw new Error('Method verifyAccessToken must be implemented');
  }

  /**
   * Verifica un refresh token
   * @param {string} refreshToken 
   * @returns {Promise<boolean>}
   */
  async verifyRefreshToken(refreshToken) {
    throw new Error('Method verifyRefreshToken must be implemented');
  }
}

module.exports = TokenService;
