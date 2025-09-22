const TokenRepository = require('../../src/domain/ports/TokenRepository');

/**
 * InMemoryTokenRepository
 * Implementación en memoria del TokenRepository para testing
 */
class InMemoryTokenRepository extends TokenRepository {
  constructor() {
    super();
    this.refreshTokens = new Map(); // refreshToken -> {userId, expiresAt}
    this.resetTokens = new Map(); // resetToken -> {userId, expiresAt}
  }

  async saveRefreshToken(userId, refreshToken, expiresAt) {
    this.refreshTokens.set(refreshToken, { userId, expiresAt });
  }

  async findRefreshToken(refreshToken) {
    return this.refreshTokens.get(refreshToken) || null;
  }

  async revokeRefreshToken(refreshToken) {
    this.refreshTokens.delete(refreshToken);
  }

  async revokeAllUserTokens(userId) {
    for (const [token, data] of this.refreshTokens.entries()) {
      if (data.userId === userId) {
        this.refreshTokens.delete(token);
      }
    }
    
    for (const [token, data] of this.resetTokens.entries()) {
      if (data.userId === userId) {
        this.resetTokens.delete(token);
      }
    }
  }

  async cleanExpiredTokens() {
    const now = new Date();
    let cleaned = 0;

    // Limpiar refresh tokens expirados
    for (const [token, data] of this.refreshTokens.entries()) {
      if (data.expiresAt <= now) {
        this.refreshTokens.delete(token);
        cleaned++;
      }
    }

    // Limpiar reset tokens expirados
    for (const [token, data] of this.resetTokens.entries()) {
      if (data.expiresAt <= now) {
        this.resetTokens.delete(token);
        cleaned++;
      }
    }

    return cleaned;
  }

  // Métodos adicionales para reset tokens
  async saveResetToken(userId, resetToken, expiresAt) {
    this.resetTokens.set(resetToken, { userId, expiresAt });
  }

  async findResetToken(resetToken) {
    return this.resetTokens.get(resetToken) || null;
  }

  async revokeResetToken(resetToken) {
    this.resetTokens.delete(resetToken);
  }

  // Métodos de utilidad para testing
  clear() {
    this.refreshTokens.clear();
    this.resetTokens.clear();
  }

  getRefreshTokenCount() {
    return this.refreshTokens.size;
  }

  getResetTokenCount() {
    return this.resetTokens.size;
  }

  getAllRefreshTokens() {
    return Array.from(this.refreshTokens.entries());
  }

  getAllResetTokens() {
    return Array.from(this.resetTokens.entries());
  }
}

module.exports = InMemoryTokenRepository;
