/**
 * SecurityPolicy
 * Define las políticas de seguridad para autenticación y bloqueos
 */
class SecurityPolicy {
  static MAX_LOGIN_ATTEMPTS = 5;
  static LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos en ms
  static REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 días en ms
  static ACCESS_TOKEN_TTL = '15m'; // 15 minutos
  static REQUIRE_TOKEN_ROTATION = true;

  /**
   * Verifica si una cuenta debe ser bloqueada
   * @param {number} attempts 
   * @returns {boolean}
   */
  static shouldLockAccount(attempts) {
    return attempts >= this.MAX_LOGIN_ATTEMPTS;
  }

  /**
   * Calcula la duración del bloqueo
   * @param {number} attempts 
   * @returns {number} Duración en ms
   */
  static getLockoutDuration(attempts) {
    // Incrementar duración con más intentos fallidos
    const multiplier = Math.min(Math.floor(attempts / this.MAX_LOGIN_ATTEMPTS), 5);
    return this.LOCKOUT_DURATION * (multiplier + 1);
  }

  /**
   * Calcula cuando expira un refresh token
   * @param {Date} issuedAt 
   * @returns {Date}
   */
  static getRefreshTokenExpiration(issuedAt = new Date()) {
    return new Date(issuedAt.getTime() + this.REFRESH_TOKEN_TTL);
  }

  /**
   * Verifica si un refresh token ha expirado
   * @param {Date} expiresAt 
   * @param {Date} currentTime 
   * @returns {boolean}
   */
  static isRefreshTokenExpired(expiresAt, currentTime = new Date()) {
    return currentTime >= expiresAt;
  }

  /**
   * Verifica si se requiere rotación de tokens
   * @returns {boolean}
   */
  static requiresTokenRotation() {
    return this.REQUIRE_TOKEN_ROTATION;
  }

  /**
   * Obtiene la configuración de TTL para access tokens
   * @returns {string}
   */
  static getAccessTokenTTL() {
    return this.ACCESS_TOKEN_TTL;
  }

  /**
   * Valida si un tiempo de bloqueo ha expirado
   * @param {Date} lockedUntil 
   * @param {Date} currentTime 
   * @returns {boolean}
   */
  static isLockoutExpired(lockedUntil, currentTime = new Date()) {
    return !lockedUntil || currentTime >= lockedUntil;
  }
}

module.exports = SecurityPolicy;
