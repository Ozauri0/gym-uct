/**
 * Logout Use Case
 * Cierra la sesión de un usuario revocando sus tokens
 */
class Logout {
  constructor({ userRepository, tokenRepository }) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
  }

  /**
   * Ejecuta el caso de uso de logout
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.refreshToken
   * @param {boolean} params.logoutAllDevices - Si true, revoca todos los tokens del usuario
   * @returns {Promise<Object>}
   */
  async execute({ userId, refreshToken, logoutAllDevices = false }) {
    try {
      // 1. Validar entrada
      this.#validateInput({ userId, refreshToken });

      // 2. Verificar que el usuario existe
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (logoutAllDevices) {
        // 3a. Logout de todos los dispositivos - revocar todos los tokens
        await this.tokenRepository.revokeAllUserTokens(userId);
      } else {
        // 3b. Logout del dispositivo actual - revocar solo el refresh token específico
        const tokenData = await this.tokenRepository.findRefreshToken(refreshToken);
        if (!tokenData) {
          // Token ya no existe o fue revocado - considerar logout exitoso
          return {
            success: true,
            message: 'Logout successful'
          };
        }

        // Verificar que el token pertenece al usuario
        if (tokenData.userId !== userId) {
          throw new Error('Token does not belong to user');
        }

        await this.tokenRepository.revokeRefreshToken(refreshToken);
      }

      // 4. Retornar resultado exitoso
      return {
        success: true,
        message: logoutAllDevices 
          ? 'Logout successful from all devices' 
          : 'Logout successful'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  #validateInput({ userId, refreshToken }) {
    if (!userId || typeof userId !== 'string') {
      throw new Error('User ID is required and must be a string');
    }

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new Error('Refresh token is required and must be a string');
    }
  }
}

module.exports = Logout;
